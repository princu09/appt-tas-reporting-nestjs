import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'src/trans-atlantic/area/area.entity';
import { KpiModule } from 'src/trans-atlantic/kpi/kpi.module';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { RecordModule } from '../record/record.module';
import { RoleModule } from '../role/role.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import {
  OrganisationController,
  OrganisationTransatlanticClientController,
  OrganisationTransatlanticController,
} from './organisation.controller';
import { Organisation } from './organisation.entity';
import { OrganisationService } from './organisation.service';

@Module({
  controllers: [
    OrganisationTransatlanticController,
    OrganisationTransatlanticClientController,
    OrganisationController,
  ],
  providers: [OrganisationService],
  imports: [
    TypeOrmModule.forFeature([
      Organisation,
      User,
      OrganisationContractor,
      Area,
    ]),
    PermissionsModule,
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule),
    RecordModule,
    KpiModule,
  ],
  exports: [OrganisationService],
})
export class OrganisationModule {}
