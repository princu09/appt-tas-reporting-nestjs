import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { TransAtRoleTitles } from 'src/auto-resources/user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class OrganisationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Organisation)
    private orgRepository: Repository<Organisation>,
    private readonly locals: LocalsService,
  ) {}
  async use(req: any, res: Response, next: () => void) {
    if (req.query.orgId) {
      this.locals.setOrganisation(
        res,
        await this.orgRepository.findOne(req.query.orgId),
      );

      if (!this.locals.getOrganisation(res)) {
        throw new BadRequestException('Organisation does not exist!');
      } else if (this.locals.getUser(res)) {
        const ret = await getConnection().query(
          `SELECT COUNT(*) FROM organisation_users_user where "userId" = $1 AND "organisationId" = $2`,
          [this.locals.getUserId(res), this.locals.getOrganisation(res).id],
        );

        // If trans admin you dont need to be in the organisation
        if (
          !ret[0].count &&
          !this.locals.getUser(res)?.isdeveloper &&
          !this.locals.getUser(res)?.isglobaladmin &&
          this.locals.getUser(res)?.type !== TransAtRoleTitles.ADMIN_ROLE
        )
          throw new BadRequestException(
            'User is not part of the organisation!',
          );
      } else {
        throw new BadRequestException('No user!');
      }
    }
    next();
  }
}
