import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationsubscriptionController } from './organisation-subscription.controller';
import { OrganisationsubscriptionService } from './organisation-subscription.service';
import { Organisationsubscription } from './organisation-subscription.entity';

@Module({
  controllers: [OrganisationsubscriptionController],
  providers: [OrganisationsubscriptionService],
  imports: [
    TypeOrmModule.forFeature([Organisationsubscription]),
    PermissionsModule,
  ],
})
export class OrganisationsubscriptionModule {}
