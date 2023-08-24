import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Repository } from 'typeorm';
import { Organisation } from '../../../src/auto-resources/organisation/organisation.entity';
import { Role } from '../../../src/auto-resources/role/role.entity';
import { Roleuser } from '../../../src/auto-resources/role-user/role-user.entity';
import { User } from '../../../src/auto-resources/user/user.entity';
import { sign } from 'jsonwebtoken';

export class UserFactoryReturn {
  public user: User
  public apiToken: string
  public organisation: Organisation
  public role: Role
  public roleUser: Roleuser
}

@Injectable()
export class UserFactory {
  private userData: Partial<User>;
  private organisation: Organisation;
  private role: Role;
  private permissions: string[] = [];

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Organisation)
    private organisationRepo: Repository<Organisation>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Roleuser)
    private roleUserRepo: Repository<Roleuser>,
  ) { }

  private clean() {
    this.userData = {};
    this.organisation = null;
    this.role = null;
    this.permissions = [];
  }
  addData(data: Partial<User>): UserFactory {
    this.userData = data;
    return this;
  }

  setOrganisation(org: Organisation): UserFactory {
    this.organisation = org;
    return this;
  }

  private async createOrg(user: User): Promise<Organisation> {
    // Create organisation if none passed in
    if (!this.organisation) {
      this.organisation = await this.organisationRepo.save({
        name: 'testOrg',
        users: [ user ]
      })
    }
    // Add user
    else {
      await this.organisationRepo.createQueryBuilder('org')
        .relation(Organisation, 'users')
        .of(this.organisation)
        .add(user)
    }

    return this.organisation
  }

  public setRole(role: Role) : UserFactory {
    this.role = role;
    return this
  }

  public addPermissions(perms: string[]) : UserFactory {
    this.permissions = this.permissions.concat(perms)
    return this;
  }

  private async createRole(user: User, org: Organisation) {
    if (!this.role) {
      this.role = this.roleRepo.create({
        owner: user.id,
        organisation: org.id.toString()
      })
      await this.roleRepo.save(this.role)
    }
    this.role.permissions = this.permissions
    const role = await this.roleRepo.save(this.role)
    const roleUser = await this.roleUserRepo.save({
      role: this.role.id,
      owner: user.id,
      organisation: org.id
    })

    return { role, roleUser }
  }

  private createApiToken(user: User, org: Organisation): string {
    return sign({
      userId: user.id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP })
  }

  async create(): Promise<UserFactoryReturn> {
    var user = await this.userRepo.save(this.userData);
    var organisation = await this.createOrg(user);
    var apiToken = await this.createApiToken(user, organisation);
    var { role, roleUser } = await this.createRole(user, organisation);

    this.clean();
    return { user, apiToken, organisation, role, roleUser }
  }
}
