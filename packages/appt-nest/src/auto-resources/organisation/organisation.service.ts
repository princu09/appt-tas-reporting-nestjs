import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { LocalsService } from 'src/services/locals/locals.service';
import { Area } from 'src/trans-atlantic/area/area.entity';
import { KpiService } from 'src/trans-atlantic/kpi/kpi.service';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { getConnection, In, Repository } from 'typeorm';
import { RecordService } from '../record/record.service';
import { RoleService } from '../role/role.service';
import {
  TransAtRoleTitles,
  TransAtUserPermissions,
  User,
} from '../user/user.entity';
import { UserService } from '../user/user.service';
import {
  Organisation,
  TransAtOrgDTO,
  TransAtOrgUpdateDTO,
} from './organisation.entity';

export const adminPerms = [
  'getorgusers',
  `usergetmany`,
  `usergetone`,
  'updateorgusers',
  `usercreateone`,
  `usercreatemany`,
  `userupdateone`,
  `userreplaceone`,
  `userdeleteone`,
  TransAtUserPermissions.CREATE_APP_USER,
  TransAtUserPermissions.CREATE_KPI_USER,
  TransAtUserPermissions.CREATE_ADMIN_USER,

  'getmyorg',
  'getallorg',
  'organisationgetmany',
  'deletemyorg',
  'deleteallorg',
  'updatemyorg',
  'updateallorg',
  'createorg',
  `organisationgetone`,
  `organisationcreateone`,
  `organisationcreatemany`,
  `organisationupdateone`,
  `organisationreplaceone`,
  `organisationdeleteone`,

  // area all org
  `areaotherowner`,
  `areagetmany`,
  `areagetone`,
  `areacreateone`,
  `areacreatemany`,
  `areaupdateone`,
  `areareplaceone`,
  `areadeleteone`,
  // contract data report all org
  `contractor-data-reportotherowner`,
  `contractor-data-reportgetmany`,
  `contractor-data-reportgetone`,
  `contractor-data-reportcreateone`,
  `contractor-data-reportcreatemany`,
  `contractor-data-reportupdateone`,
  `contractor-data-reportreplaceone`,
  `contractor-data-reportdeleteone`,

  // kpi all org
  'getkpis',

  `incident-flash-reportotherowner`,
  `incident-flash-reportgetmany`,
  `incident-flash-reportgetone`,
  `incident-flash-reportcreateone`,
  `incident-flash-reportcreatemany`,
  `incident-flash-reportupdateone`,
  `incident-flash-reportreplaceone`,
  `incident-flash-reportdeleteone`,

  `organisationcontractorotherowner`,
  `organisationcontractorgetmany`,
  `organisationcontractorgetone`,
  `organisationcontractorcreateone`,
  `organisationcontractorcreatemany`,
  `organisationcontractorupdateone`,
  `organisationcontractorreplaceone`,
  `organisationcontractordeleteone`,
  `organisationcontractorassign`,

  `lost-time-reportotherowner`,
  `lost-time-reportgetmany`,
  `lost-time-reportgetone`,
  `lost-time-reportcreateone`,
  `lost-time-reportcreatemany`,
  `lost-time-reportupdateone`,
  `lost-time-reportreplaceone`,
  `lost-time-reportdeleteone`,
  `lost-time-reportassign`,

  `safety-observationsotherowner`,
  `safety-observationsgetmany`,
  `safety-observationsgetone`,
  `safety-observationscreateone`,
  `safety-observationscreatemany`,
  `safety-observationsupdateone`,
  `safety-observationsreplaceone`,
  `safety-observationsdeleteone`,
]; // TODO,

export const HSEPerms = [
  'getmyorg',

  // contract data report all org
  `contractor-data-reportotherowner`,
  `contractor-data-reportgetmany`,
  `contractor-data-reportgetone`,
  `contractor-data-reportcreateone`,
  `contractor-data-reportupdateone`,
];

export const kpiPerms = [
  'getorgusers',
  `usergetmany`,
  `usergetone`,
  'updateorgusers',
  `usercreateone`,
  `usercreatemany`,
  `userupdateone`,
  `userreplaceone`,
  `userdeleteone`,
  `deletemyuser`,
  TransAtUserPermissions.CREATE_APP_USER,
  TransAtUserPermissions.CREATE_KPI_USER,

  'getmyorg',
  'organisationgetmany',

  // area all org
  `areaotherowner`,
  `areagetmany`,
  `areagetone`,
  `areacreateone`,
  `areacreatemany`,
  `areaupdateone`,
  `areareplaceone`,
  `areadeleteone`,
  // contract data report all org
  `contractor-data-reportotherowner`,
  `contractor-data-reportgetmany`,
  `contractor-data-reportgetone`,
  `contractor-data-reportcreateone`,
  `contractor-data-reportcreatemany`,
  `contractor-data-reportupdateone`,
  `contractor-data-reportreplaceone`,
  `contractor-data-reportdeleteone`,

  `lost-time-reportotherowner`,
  `lost-time-reportgetmany`,
  `lost-time-reportgetone`,
  `lost-time-reportcreateone`,
  `lost-time-reportcreatemany`,
  `lost-time-reportupdateone`,
  `lost-time-reportreplaceone`,
  `lost-time-reportdeleteone`,
  `lost-time-reportassign`,

  // kpi all org
  'getkpis',

  `incident-flash-reportotherowner`,
  `incident-flash-reportgetmany`,
  `incident-flash-reportgetone`,
  `incident-flash-reportcreateone`,
  `incident-flash-reportcreatemany`,
  `incident-flash-reportupdateone`,
  `incident-flash-reportreplaceone`,
  `incident-flash-reportdeleteone`,

  `organisationcontractorotherowner`,
  `organisationcontractorgetmany`,
  `organisationcontractorgetone`,
  `organisationcontractorcreateone`,
  `organisationcontractorcreatemany`,
  `organisationcontractorupdateone`,
  `organisationcontractorreplaceone`,
  `organisationcontractordeleteone`,
  `organisationcontractorassign`,

  `safety-observationsotherowner`,
  `safety-observationsgetmany`,
  `safety-observationsgetone`,
  `safety-observationscreateone`,
  `safety-observationscreatemany`,
  `safety-observationsupdateone`,
  `safety-observationsreplaceone`,
  `safety-observationsdeleteone`,
];

export const appPerms = [
  // can update our own user
  'getmyuser',
  'updatemyuser',
  `usergetmany`,
  `usergetone`,
  `userupdateone`,
  `deletemyuser`,

  // can get our own org
  'getmyorg',
  'organisationgetone',
  'organisationgetmany',

  // can get all areas attached to our org
  `areaotherowner`,
  `areagetmany`,
  `areagetone`,

  // can get all org contracts attached to our org
  `organisationcontractorotherowner`,
  `organisationcontractorgetmany`,
  `organisationcontractorgetone`,

  // can only crud on our own reports
  `incident-flash-reportotherowner`,
  `incident-flash-reportgetmany`,
  `incident-flash-reportgetone`,
  `incident-flash-reportcreateone`,
  `incident-flash-reportcreatemany`,
  `incident-flash-reportupdateone`,
  `incident-flash-reportreplaceone`,

  `safety-observationsotherowner`,
  `safety-observationsgetmany`,
  `safety-observationsgetone`,
  `safety-observationscreateone`,
  `safety-observationsupdateone`,
  `incident-flash-reportreplaceone`,

  // contract data report all org
  `contractor-data-reportgetmany`,
  `contractor-data-reportgetone`,
  `contractor-data-reportcreateone`,
  `contractor-data-reportupdateone`,
];

@Injectable()
export class OrganisationService extends TypeOrmCrudService<Organisation> {
  // eslint-disable-next-line
  uploadFiles(res: any, files: Express.Multer.File[]) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(OrganisationService.name);

  constructor(
    @InjectRepository(Organisation) public repo: Repository<Organisation>,
    @InjectRepository(User) protected userRepo: Repository<User>,
    @InjectRepository(OrganisationContractor)
    protected contractorRepo: Repository<OrganisationContractor>,
    @InjectRepository(Area) protected areaRepo: Repository<Area>,
    @Inject(forwardRef(() => UserService))
    public userService: UserService,
    @Inject(forwardRef(() => RoleService))
    public roleService: RoleService,
    public recordService: RecordService,
    public kpiService: KpiService,
    private localService: LocalsService,
  ) {
    super(repo);
  }
  async deleteOne(crudRequest: CrudRequest) {
    const myEntity = await this.getOneOrFail(crudRequest);
    return this.repo.softRemove(myEntity);
  }
  async userInOrganisation(userId: string, orgId: string): Promise<boolean> {
    if (!userId || !orgId) return false;

    let ret = null;
    try {
      ret = await getConnection().query(
        `SELECT COUNT(*) FROM organisation_users_user where "userId" = $1 AND "organisationId" = $2`,
        [userId, orgId],
      );
    } catch (err) {
      return false;
    }

    return ret[0].count;
  }
  async getDefaultOrg(): Promise<Organisation> {
    return await this.repo.findOne(process.env.DEFAULT_ORG_UUID);
  }

  async addUserToOrg(
    userId: string,
    organisation: Organisation,
    setDefaultRole = false,
  ) {
    const user = await this.userRepo.findOneOrFail(userId, {
      relations: ['organisations'],
    });
    user.organisations.push(organisation);
    await this.userRepo.save(user);

    if (setDefaultRole) {
      await this.roleService.addUserDefaultRole(userId, organisation);
    }
  }

  async createTransAtRoles(org: Organisation, owner: User) {
    await this.roleService.repo.save({
      title: TransAtRoleTitles.HSE_ROLE,
      organisationModel: org,
      ownerModel: owner,
      permissions: HSEPerms,
    });
    await this.roleService.repo.save({
      title: TransAtRoleTitles.KPI_ROLE,
      organisationModel: org,
      ownerModel: owner,
      permissions: kpiPerms,
    });
    await this.roleService.repo.save({
      title: TransAtRoleTitles.APP_ROLE,
      organisationModel: org,
      ownerModel: owner,
      permissions: appPerms,
    });
    await this.roleService.repo.save({
      title: TransAtRoleTitles.ADMIN_ROLE,
      organisationModel: org,
      ownerModel: owner,
      permissions: adminPerms,
    });
  }

  async updateAllTransAtRolePerms() {
    await this.roleService.repo.update(
      { title: TransAtRoleTitles.KPI_ROLE },
      {
        permissions: kpiPerms,
      },
    );
    await this.roleService.repo.update(
      { title: TransAtRoleTitles.APP_ROLE },
      {
        permissions: appPerms,
      },
    );
    await this.roleService.repo.update(
      { title: TransAtRoleTitles.ADMIN_ROLE },
      {
        permissions: adminPerms,
      },
    );
    await this.roleService.repo.update(
      { title: TransAtRoleTitles.HSE_ROLE },
      {
        permissions: HSEPerms,
      },
    );
  }

  async updateTransAtOrg(res: Response, data: TransAtOrgUpdateDTO) {
    let { newKpiUsers, deletedUsersIds, newHseUsers } = data;
    const { areas, organisation, contractors } = data;
    let org = null;

    if (!Array.isArray(newHseUsers)) newHseUsers = [];
    if (!Array.isArray(deletedUsersIds)) deletedUsersIds = [];
    if (!Array.isArray(newKpiUsers)) newKpiUsers = [];

    try {
      await this.repo.save(organisation);
      org = await this.repo
        .createQueryBuilder('org')
        .where('org.id = :id', { id: organisation.id })
        .leftJoinAndSelect('org.users', 'users')
        .leftJoinAndSelect('org.areas', 'areas')
        .leftJoinAndSelect('org.contractors', 'contractors')
        .getOne();

      // Find objects that are in org.areas but not in areas
      const areasToDelete = org.areas
        .filter((area) => !areas.find((areaInOrg) => areaInOrg.id === area.id))
        .map((x) => x.id);
      if (areasToDelete.length) {
        await this.areaRepo.softDelete({ id: In(areasToDelete) });
      }

      // Set orgs and owners
      for (const area of areas) {
        if (!area.organisation || !area.owner) {
          area.organisation = org.id;
          area.owner = this.localService.getUserId(res);
        }
      }

      await this.areaRepo.save(areas);
    } catch (err) {
      this.logger.error(err);
    }

    try {
      // Find objects that are in org.contractors but not in contractors and delete them
      const contractorsToDelete = org.contractors
        .filter(
          (contractor) =>
            !contractors.find(
              (contractorInOrg) => contractorInOrg.id === contractor.id,
            ),
        )
        .map((x) => x.id);
      if (contractorsToDelete.length) {
        await this.contractorRepo.softDelete({ id: In(contractorsToDelete) });
      }

      // Set orgs and owners
      for (const contract of contractors) {
        if (!contract.organisation || !contract.owner) {
          contract.organisation = org.id;
          contract.owner = this.localService.getUserId(res);
        }
      }

      await this.contractorRepo.save(contractors);

      // Remove users from org
      for (const u of deletedUsersIds) {
        try {
          await this.removeUserFromOrg(u, org);
        } catch (err) {
          this.logger.error(err);
        }
      }
    } catch (err) {
      this.logger.error(err);
    }

    try {
      const createUser = async (
        email: string,
        roleTitle: TransAtRoleTitles,
      ) => {
        if (org.users.find((u) => u.email === email)) return;

        const user = await this.userRepo.findOne({ email: email });
        if (!user) {
          // Create and assign user
          await this.userService.transAtInvite(
            { username: email, email: email },
            roleTitle,
            org,
          );
        } else {
          await this.addUserToOrg(user.id, org);

          // assign the role
          const role = await this.roleService.repo.findOne({
            title: roleTitle,
            organisation: org.id,
          });

          if (!role) {
            this.logger.error(
              `ERROR: This organisation has no role for ${roleTitle},${org.id}`,
            );
            return;
          }

          await this.roleService.assignUserRole(user.id, role);
        }
      };

      // Create new users
      for (const email of newKpiUsers) {
        await createUser(email, TransAtRoleTitles.KPI_ROLE);
      }
      for (const email of newHseUsers) {
        await createUser(email, TransAtRoleTitles.HSE_ROLE);
      }

      // Update the kpis
      org = await this.repo
        .createQueryBuilder('org')
        .where('org.id = :id', { id: organisation.id })
        .leftJoinAndSelect('org.users', 'users')
        .leftJoinAndSelect('org.areas', 'areas')
        .leftJoinAndSelect('org.contractors', 'contractors')
        .getOne();
      await this.kpiService.getKpiList(res, org);
    } catch (err) {
      this.logger.error(err);
      throw new Error('Failed to save new users');
    }
  }

  async createTransAtOrg(res: Response, data: TransAtOrgDTO) {
    try {
      const reqUser = this.localService.getUserId(res);
      data.organisation.admin = this.localService.getUserId(res);
      data.organisation.owner = this.localService.getUserId(res);
      const newOrg = await this.repo.save(data.organisation);
      await this.createTransAtRoles(newOrg, this.localService.getUser(res));

      // The default contractor
      await this.contractorRepo.save({
        name: newOrg.name,
        organisation: newOrg.id,
        owner: reqUser,
        default: true,
      });

      const createUser = async (
        email: string,
        roleTitle: TransAtRoleTitles,
      ) => {
        const user = await this.userRepo.findOne({ email: email });

        if (!user) {
          // Create and assign user
          await this.userService.transAtInvite(
            { username: email, email: email },
            roleTitle,
            newOrg,
          );
        } else {
          await this.addUserToOrg(user.id, newOrg);

          // assign the role
          const role = await this.roleService.repo.findOne({
            title: roleTitle,
            organisation: newOrg.id,
          });

          if (!role) {
            this.logger.error(
              `ERROR: This organisation has no role for ${roleTitle},${newOrg.id}`,
            );
            return;
          }

          await this.roleService.assignUserRole(user.id, role);
        }
      };

      // Create the users
      for (const email of data.kpiUsers) {
        await createUser(email, TransAtRoleTitles.KPI_ROLE);
      }

      for (const email of data.HSEUsers) {
        await createUser(email, TransAtRoleTitles.HSE_ROLE);
      }

      {
        // Add current user
        await this.addUserToOrg(reqUser, newOrg);

        // assign the role
        const role = await this.roleService.repo.findOne({
          title: TransAtRoleTitles.ADMIN_ROLE,
          organisation: newOrg.id,
        });

        if (!role) {
          this.logger.error(
            `ERROR: This organisation has no role for ${TransAtRoleTitles.KPI_ROLE},${newOrg.id}`,
          );
          return;
        }

        await this.roleService.assignUserRole(reqUser, role);
      }
      {
        // Create contractors
        for (const contractor of data.newContractors) {
          await this.contractorRepo.save({
            name: contractor,
            organisation: newOrg.id,
            owner: reqUser,
          });
        }
      }
      {
        // Create Area
        for (const area of data.newAreas) {
          await this.areaRepo.save({
            name: area,
            organisation: newOrg.id,
            owner: reqUser,
          });
        }
      }

      // Get the kpis and save them to the enabled kpis
      newOrg.enabledKPIs = await this.kpiService.getKpiList(res, newOrg);
      await this.repo.save(newOrg);
      return this.repo.findOne({ id: newOrg.id });
    } catch (err) {
      this.logger.error(`Failed to create transatlantic organisation`, err);
      throw new InternalServerErrorException();
    }
  }

  async removeUserFromOrg(userId: string, organisation: Organisation) {
    const user = await this.userRepo.findOneOrFail(userId, {
      relations: ['organisations', 'roles'],
    });
    const index = user.organisations.map((x) => x.id).indexOf(organisation.id);
    if (index > -1) {
      user.organisations.splice(index, 1);
      user.roles = user.roles.filter((x) => x.organisation !== organisation.id);
      await this.userRepo.save(user);
    }
  }

  async getClientData(res: Response) {
    const reqUser = this.localService.getUser(res);
    if (
      ![
        TransAtRoleTitles.ADMIN_ROLE as string,
        TransAtRoleTitles.KPI_ROLE,
      ].includes(reqUser.type) &&
      !reqUser.isglobaladmin &&
      !reqUser.isdeveloper
    )
      throw new ForbiddenException();

    const data = await this.repo
      .createQueryBuilder('org')
      .where('org.id = :id', { id: this.localService.getOrganisation(res).id })
      .leftJoinAndSelect('org.users', 'users')
      .leftJoinAndSelect('org.contractors', 'contractors')
      .leftJoinAndSelect('org.areas', 'areas')
      .getOne();

    const hseUsers = data.users.filter(
      (x) => x.type === TransAtRoleTitles.HSE_ROLE,
    );
    data.users = data.users.filter(
      (x) => x.type === TransAtRoleTitles.KPI_ROLE,
    );

    return {
      data: data,
      HSEUsers: hseUsers,
    };
  }

  async newLogo(res: Response, file: Express.Multer.File) {
    const ret = await this.recordService.uploadFiles(res, [file]);

    // Escape early if bad
    if (!ret.records.length) return ret;

    // Update the logo
    const org = this.localService.getOrganisation(res);
    org.logo = ret.records[0];
    await this.repo.save(org);
    return this.repo.findOne(org.id);
  }
}
