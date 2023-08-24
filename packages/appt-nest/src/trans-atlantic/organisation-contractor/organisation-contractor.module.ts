import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationModule } from 'src/auto-resources/organisation/organisation.module';
import { User } from 'src/auto-resources/user/user.entity';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationContractorController } from './organisation-contractor.controller';
import { OrganisationContractor } from './organisation-contractor.entity';
import { OrganisationContractorService } from './organisation-contractor.service';

@Module({
  controllers: [OrganisationContractorController],
  providers: [OrganisationContractorService],
  exports: [OrganisationContractorService],
  imports: [
    TypeOrmModule.forFeature([OrganisationContractor, User]),
    PermissionsModule,
    OrganisationModule,
  ],
})
export class OrganisationContractorModule {}
