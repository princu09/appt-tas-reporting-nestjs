import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationContractController } from './organisation-contract.controller';
import { OrganisationContractService } from './organisation-contract.service';
import { OrganisationContract } from './organisation-contract.entity';

@Module({
  controllers: [OrganisationContractController],
  providers: [OrganisationContractService],
  imports: [
    TypeOrmModule.forFeature([OrganisationContract]),
    PermissionsModule,
  ],
})
export class OrganisationContractModule {}
