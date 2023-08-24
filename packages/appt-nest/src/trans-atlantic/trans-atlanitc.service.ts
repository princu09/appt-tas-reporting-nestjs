import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import {
  HSEPerms,
  OrganisationService,
  adminPerms,
  appPerms,
  kpiPerms,
} from 'src/auto-resources/organisation/organisation.service';
import { Role } from 'src/auto-resources/role/role.entity';
import { TransAtRoleTitles } from 'src/auto-resources/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransatlanticService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TransatlanticService.name);

  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Organisation)
    private orgRepo: Repository<Organisation>,
    private orgService: OrganisationService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV !== 'test') await this.bootstrap();
  }

  async bootstrap() {
    this.logger.log('Bootstrapping started');

    try {
      await this.roleRepo.update(
        {
          title: TransAtRoleTitles.ADMIN_ROLE,
        },
        {
          permissions: adminPerms,
        },
      );

      await this.roleRepo.update(
        {
          title: TransAtRoleTitles.KPI_ROLE,
        },
        {
          permissions: kpiPerms,
        },
      );

      await this.roleRepo.update(
        {
          title: TransAtRoleTitles.APP_ROLE,
        },
        {
          permissions: appPerms,
        },
      );

      await this.roleRepo.update(
        {
          title: TransAtRoleTitles.HSE_ROLE,
        },
        {
          permissions: HSEPerms,
        },
      );

      // Create all orgs
      const organisations = await this.orgRepo.find({
        relations: ['roles', 'adminModel'],
      });
      for (const org of organisations) {
        if (
          !org.roles.find((x) => x.title === TransAtRoleTitles.ADMIN_ROLE) ||
          !org.roles.find((x) => x.title === TransAtRoleTitles.APP_ROLE) ||
          !org.roles.find((x) => x.title === TransAtRoleTitles.HSE_ROLE) ||
          !org.roles.find((x) => x.title === TransAtRoleTitles.KPI_ROLE)
        ) {
          if (org.adminModel) {
            try {
              await this.orgService.createTransAtRoles(org, org.adminModel);
            } catch (err) {
              this.logger.error(err, `: Creating roles for ${org.id}`);
            }
          }
        }
      }
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.log('DONE!');
  }
}
