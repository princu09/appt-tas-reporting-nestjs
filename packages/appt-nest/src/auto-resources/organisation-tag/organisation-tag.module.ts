import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationtagController } from './organisation-tag.controller';
import { OrganisationtagService } from './organisation-tag.service';
import { Organisationtag } from './organisation-tag.entity';

@Module({
  controllers: [OrganisationtagController],
  providers: [OrganisationtagService],
  imports: [TypeOrmModule.forFeature([Organisationtag]), PermissionsModule],
})
export class OrganisationtagModule {}
