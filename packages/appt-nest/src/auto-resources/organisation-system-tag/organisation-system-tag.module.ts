import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationsystemtagController } from './organisation-system-tag.controller';
import { OrganisationsystemtagService } from './organisation-system-tag.service';
import { Organisationsystemtag } from './organisation-system-tag.entity';

@Module({
  controllers: [OrganisationsystemtagController],
  providers: [OrganisationsystemtagService],
  imports: [
    TypeOrmModule.forFeature([Organisationsystemtag]),
    PermissionsModule,
  ],
})
export class OrganisationsystemtagModule {}
