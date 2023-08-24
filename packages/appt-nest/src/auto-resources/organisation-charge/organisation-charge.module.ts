import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationChargeController } from './organisation-charge.controller';
import { OrganisationChargeService } from './organisation-charge.service';
import { OrganisationCharge } from './organisation-charge.entity';

@Module({
  controllers: [OrganisationChargeController],
  providers: [OrganisationChargeService],
  imports: [TypeOrmModule.forFeature([OrganisationCharge]), PermissionsModule],
})
export class OrganisationChargeModule {}
