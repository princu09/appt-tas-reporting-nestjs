import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../auto-resources/site/site.entity';
import { Siteuser } from '../auto-resources/site-user/site-user.entity';
import { LocalsService } from '../services/locals/locals.service';
import { Siteadmin } from 'src/auto-resources/site-admin/site-admin.entity';

@Injectable()
export class SiteMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Site)
    private siteRepo: Repository<Site>,
    private readonly locals: LocalsService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    this.locals.setSite(res, null);
    if (this.locals.getOrganisation(res)?.hassites) {
      if (
        !req.query.hasOwnProperty('siteId') ||
        !req.query.siteId ||
        req.query.siteId === ''
      )
        throw new BadRequestException('Missing siteId parameter');

      const ret = await this.siteRepo
        .createQueryBuilder('site')
        .select('site.*')
        .leftJoin(
          Siteadmin,
          'sa',
          'sa.site = site.id AND sa.owner = :owner AND sa.organisation = :org',
          {
            owner: this.locals.getUserId(res),
            org: this.locals.getOrganisation(res).id,
          },
        )
        .leftJoin(
          Siteuser,
          'su',
          'su.site = site.id AND su.owner = :owner AND su.organisation = :org',
          {
            owner: this.locals.getUserId(res),
            org: this.locals.getOrganisation(res).id,
          },
        )
        .where(
          '(sa.owner IS NOT NULL OR su.owner IS NOT NULL) AND site.id = :site',
          { site: req.query.siteId },
        )
        .execute();

      if (!ret.length) throw new BadRequestException('Bad Site ID!');

      this.locals.setSite(res, ret[0]);
    }
    return next();
  }
}
