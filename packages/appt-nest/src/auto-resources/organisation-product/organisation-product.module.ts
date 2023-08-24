import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationProductController } from './organisation-product.controller';
import { OrganisationProductService } from './organisation-product.service';
import { OrganisationProduct } from './organisation-product.entity';

@Module({
  controllers: [OrganisationProductController],
  providers: [OrganisationProductService],
  imports: [TypeOrmModule.forFeature([OrganisationProduct]), PermissionsModule],
})
export class OrganisationProductModule {}
