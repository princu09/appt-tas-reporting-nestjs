import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from '../../../src/auto-resources/organisation/organisation.entity';
import { Role } from '../../../src/auto-resources/role/role.entity';
import { Roleuser } from '../../../src/auto-resources/role-user/role-user.entity';
import { Site } from '../../../src/auto-resources/site/site.entity';
import { Siteadmin } from '../../../src/auto-resources/site-admin/site-admin.entity';
import { Siteuser } from '../../../src/auto-resources/site-user/site-user.entity';
import { User } from '../../../src/auto-resources/user/user.entity';

@Injectable()
export class SiteFactory {
  private siteData: Partial<Site>;
  private adminUser: User;
  private users: User[];

  constructor(
    @InjectRepository(Site)
    private siteRepo: Repository<Site>,
    @InjectRepository(Organisation)
    private orgRepo: Repository<Organisation>,
    @InjectRepository(Siteadmin)
    private siteAdminRepo: Repository<Siteadmin>,
    @InjectRepository(Siteuser)
    private siteUserRepo: Repository<Siteuser>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Roleuser)
    private roleUserRepo: Repository<Roleuser>,
  ) {
    this.users = [];
  }

  private clean() {
    this.siteData = {};
    this.users = [];
    this.adminUser = null;
  }
  addData(data: Partial<Site>): SiteFactory {
    this.siteData = data;
    return this;
  }
  addUser(user: User): SiteFactory {
    this.users.push(user)
    return this;
  }
  addAdminUser(user: User): SiteFactory {
    this.adminUser = user;
    return this;
  }

  async create(org: Organisation): Promise<Site> {
    let site = this.siteRepo.create(this.siteData)
    site.organisation = org.id
    site.owner = this.users[0].id
    site = await this.siteRepo.save(site)

    if (this.adminUser) await this.addAdminUserToSite(site, this.adminUser, org)

    for (const u of this.users) {
      await this.addUserToSite(site, u, org)
    }

    await this.orgRepo.update(org.id, { hassites: true, })
    await this.roleRepo
      .createQueryBuilder()
      .update()
      .set({ site: site.id })
      .where('organisation = :org', { org: org.id })
      .execute()

    await this.roleUserRepo
      .createQueryBuilder()
      .update()
      .set({ site: site.id })
      .where('organisation = :org', { org: org.id })
      .execute()

    this.clean();
    return site
  }

  async addUserToSite(site: Site, user: User, organisation: Organisation) {
    await this.siteUserRepo.insert({
      site: site.id,
      owner: user.id,
      organisation: organisation.id
    })
  }
  async addAdminUserToSite(site: Site, user: User, organisation: Organisation) {
    await this.siteAdminRepo.insert({
      site: site.id,
      owner: user.id,
      organisation: organisation.id
    })
  }
}
