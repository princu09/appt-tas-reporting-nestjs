import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationEmailTemplateController } from './organisation-email-template.controller';
import { OrganisationEmailTemplate } from './organisation-email-template.entity';
import { OrganisationEmailTemplateService } from './organisation-email-template.service';

@Module({
  controllers: [OrganisationEmailTemplateController],
  providers: [OrganisationEmailTemplateService],
  exports: [OrganisationEmailTemplateService],
  imports: [
    TypeOrmModule.forFeature([OrganisationEmailTemplate]),
    PermissionsModule,
  ],
})
export class OrganisationEmailTemplateModule {}
