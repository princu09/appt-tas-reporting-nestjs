import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationUserPurchasesController } from './organisation-user-purchases.controller';
import { OrganisationUserPurchasesService } from './organisation-user-purchases.service';
import { OrganisationUserPurchases } from './organisation-user-purchases.entity';

@Module({
  controllers: [OrganisationUserPurchasesController],
  providers: [OrganisationUserPurchasesService],
  imports: [
    TypeOrmModule.forFeature([OrganisationUserPurchases]),
    PermissionsModule,
  ],
})
export class OrganisationUserPurchasesModule {}
