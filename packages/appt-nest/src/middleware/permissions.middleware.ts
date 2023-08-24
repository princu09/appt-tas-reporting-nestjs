import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Roleuser } from '../auto-resources/role-user/role-user.entity';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class PermissionsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Roleuser)
    private roleUserRepo: Repository<Roleuser>,
    private locals: LocalsService,
  ) {}

  async use(req: any, res: Response, next: () => void) {
    // Do we have a user and an organisation ?
    if (this.locals.getUserId(res) && this.locals.getOrganisation(res)) {
      const roles = await this.roleUserRepo.find({
        owner: this.locals.getUserId(res),
        organisation: this.locals.getOrganisation(res).id,
        ...(this.locals.getSite(res) && { site: this.locals.getSite(res).id }),
      });

      // flatten the array
      this.locals.setUserPermissions(
        res,
        // eslint-disable-next-line
        [].concat
          .apply(
            [],
            roles.map((x) => x.roleModel.permissions),
          )
          .map((x) => x.toLocaleLowerCase()),
      );
    } else {
      this.locals.setUserPermissions(res, []);
    }
    next();
  }
}
