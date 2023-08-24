import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { OrganisationService } from 'src/auto-resources/organisation/organisation.service';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { SiteService } from 'src/auto-resources/site/site.service';
import { Repository } from 'typeorm';

@Injectable()
export class WebSocketGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private organisationSevice: OrganisationService,
    private siteService: SiteService,
    @InjectRepository(Roleuser) public roleUserRepo: Repository<Roleuser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const data = context.switchToWs().getData();

    const authHeader = socket.handshake.headers['authorization'];
    const { orgId, siteId } = data;

    if (!authHeader) throw new WsException('Missing authorization header');
    if (!orgId) throw new WsException('Missing orgId query parameter');

    // Validate JWT
    const token = this.authService.validateToken(authHeader);
    if (!token) throw new WsException('Invalid authorization token');
    data.requestUserId = token.userId;

    // Validate Organisation
    if (
      !(await this.organisationSevice.userInOrganisation(
        data.requestUserId,
        orgId,
      ))
    )
      throw new WsException('Invalid orgId parameter');

    // Validate Site
    const organisation = await this.organisationSevice.findOne(orgId);
    if (
      !(await this.siteService.validSite(
        organisation,
        siteId,
        data.requestUserId,
      ))
    )
      throw new WsException('Invalid siteId parameter');

    // Get the users permissions
    const roles = await this.roleUserRepo.find({
      owner: data.requestUserId,
      organisation: data.orgId,
      ...(siteId && { site: siteId }),
    });

    // eslint-disable-next-line
    data.permissions = [].concat
      .apply(
        [],
        roles.map((x) => x.roleModel.permissions),
      )
      .map((x) => x.toLocaleLowerCase());
    return true;
  }
}
