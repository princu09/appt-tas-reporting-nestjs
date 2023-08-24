import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Organisation } from '../organisation/organisation.entity';
import { Siteadmin } from '../site-admin/site-admin.entity';
import { Siteuser } from '../site-user/site-user.entity';
import { Site } from './site.entity';

@Injectable()
export class SiteService extends TypeOrmCrudService<Site> {
  constructor(@InjectRepository(Site) repo) {
    super(repo);
  }

  async deleteOne(crudRequest: CrudRequest) {
    const myEntity = await this.getOneOrFail(crudRequest);
    return this.repo.softRemove(myEntity);
  }

  async validSite(org: Organisation, siteId: string, userId: string) {
    if (!org.hassites) return true;

    const ret = await this.repo
      .createQueryBuilder('site')
      .select('site.*')
      .leftJoin(
        Siteadmin,
        'sa',
        'sa.site = site.id AND sa.owner = :owner AND sa.organisation = :org',
        { owner: userId, org: org.id },
      )
      .leftJoin(
        Siteuser,
        'su',
        'su.site = site.id AND su.owner = :owner AND su.organisation = :org',
        { owner: userId, org: org.id },
      )
      .where(
        '(sa.owner IS NOT NULL OR su.owner IS NOT NULL) AND site.id = :site',
        { site: siteId },
      )
      .execute();

    return ret.length;
  }
}
