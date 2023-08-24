import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Organisation } from '../organisation/organisation.entity';
import { Roleuser } from '../role-user/role-user.entity';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role) public repo: Repository<Role>,
    @InjectRepository(Roleuser) public roleUserRepo: Repository<Roleuser>,
  ) {
    super(repo);
  }

  async assignUserRole(userId: string, role: Role) {
    // Already exists
    if (await this.roleUserRepo.count({ where: { role: role, owner: userId } }))
      return;

    return await this.roleUserRepo.save({
      owner: userId,
      role: role.id,
      organisation: role.organisation,
      site: role.site,
    });
  }

  async addUserDefaultRole(userId: string, org: Organisation) {
    const roles = await this.repo.find({
      organisation: org.id,
      defaultrole: true,
    });

    for (const role of roles) {
      try {
        await this.assignUserRole(userId, role);
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
