import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  Res,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Response } from 'express';
import { UserHasPermissionOneOrMoreGuard } from 'src/guards/user-has-permission-one-or-more.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { LocalsService } from 'src/services/locals/locals.service';
import { Repository } from 'typeorm';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { User } from '../user/user.entity';
import { EmailTemplateAttachments } from './email-template-attachments.entity';
import { EmailTemplateTriggerService } from './email-template-trigger/email-template-trigger.service';
import { EmailTemplate, EmailTemplateDTO } from './email-template.entity';
import { SEND_EMAIL_TEMPLATE } from './email-template.permissions';
import { EmailTemplateService } from './email-template.service';
import { OrganisationTemplateCheck } from './organisation-template-check/organisation-template-check.interceptor';

@Crud({
  model: {
    type: EmailTemplate,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
    attachmentId: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    create: EmailTemplateDTO,
  },
  ...defaultCrudPermissions('emailtemplate'),
})
@ApiTags('emailtemplate')
@Controller('emailtemplate')
@UseInterceptors(
  OrgSiteOwnerPermissionInterceptor,
  CrudRequestInterceptor,
  OrganisationTemplateCheck,
)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class EmailTemplateController implements CrudController<EmailTemplate> {
  constructor(
    public service: EmailTemplateService,
    public triggerService: EmailTemplateTriggerService,
    public locals: LocalsService,
    @InjectRepository(EmailTemplate)
    public repo: Repository<EmailTemplate>,
    @InjectRepository(EmailTemplateAttachments)
    public attachmentRepo: Repository<EmailTemplateAttachments>,
  ) {}

  @Post('send/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [SEND_EMAIL_TEMPLATE])
  async sendEmail(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    return this.triggerService.sendEmail(
      res,
      await this.repo.findOne(id),
      User.getEmailTriggerContext(this.locals.getUser(res)),
    );
  }

  @Patch(':id/attachments')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(UserHasPermissionOneOrMoreGuard)
  @SetMetadata('permissions', [
    `emailtemplateCreateOne`,
    `emailtemplateCreateMany`,
    `emailtemplateUpdateOne`,
    `emailtemplateReplaceOne`,
  ])
  async addAttachemnts(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const template = await this.repo.findOneOrFail({ where: { id } });
    return await this.service.processAttachments(template, null, files, res);
  }

  @Put(':id/attachments')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(UserHasPermissionOneOrMoreGuard)
  @SetMetadata('permissions', [
    `emailtemplateCreateOne`,
    `emailtemplateCreateMany`,
    `emailtemplateUpdateOne`,
    `emailtemplateReplaceOne`,
  ])
  async replaceAttachemnts(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const template = await this.repo.findOneOrFail({ where: { id } });

    // Remove existing attachments
    await this.attachmentRepo.delete({ emailTemplate: template });

    template.attachments = [];

    return await this.service.processAttachments(template, null, files, res);
  }

  @Delete(':id/attachments/:attachmentId')
  @UseGuards(UserHasPermissionOneOrMoreGuard)
  @SetMetadata('permissions', [
    `emailtemplateUpdateOne`,
    `emailtemplateReplaceOne`,
    `emailtemplateDeleteOne`,
  ])
  async deleteAttachment(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    if (!(await this.repo.count({ where: { id } })))
      throw new BadRequestException('No matching template id');
    return this.attachmentRepo.delete({
      emailTemplateId: id,
      id: attachmentId,
    });
  }

  @Override()
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`emailtemplateCreateOne`])
  async createOne(
    @Res({ passthrough: true }) res: Response,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: EmailTemplateDTO,
  ): Promise<EmailTemplate> {
    const newEmail = await this.service.createOne(req, {
      ...dto,
      ...{ attachments: [] },
    });
    return this.service.processAttachments(
      newEmail,
      dto.attachments,
      null,
      res,
    );
  }

  @Override()
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`emailtemplateCreateMany`])
  async createMany(
    @Res({ passthrough: true }) res: Response,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<EmailTemplateDTO>,
  ): Promise<EmailTemplate[]> {
    const ret = [];
    for (const tmp of dto.bulk) {
      const newEmail = await this.service.createOne(req, {
        ...tmp,
        ...{ attachments: [] },
      });
      ret.push(
        await this.service.processAttachments(
          newEmail,
          tmp.attachments,
          null,
          res,
        ),
      );
    }
    return ret;
  }
}
