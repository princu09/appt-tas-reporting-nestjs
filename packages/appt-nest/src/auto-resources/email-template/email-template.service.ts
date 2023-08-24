import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { Record } from 'src/auto-resources/record/record.entity';
import { LocalsService } from 'src/services/locals/locals.service';
import { Repository } from 'typeorm';
import { RecordService } from '../record/record.service';
import { EmailTemplateAttachments } from './email-template-attachments.entity';
import { EmailTemplate } from './email-template.entity';

@Injectable()
export class EmailTemplateService extends TypeOrmCrudService<EmailTemplate> {
  constructor(
    @InjectRepository(EmailTemplate)
    public repo: Repository<EmailTemplate>,
    @InjectRepository(Record)
    public recordRepo: Repository<Record>,
    @InjectRepository(EmailTemplateAttachments)
    public emailAttachmentRepo: Repository<EmailTemplateAttachments>,
    public recordService: RecordService,
    public localService: LocalsService,
  ) {
    super(repo);
  }

  async processAttachments(
    template: EmailTemplate,
    attachments: string[] | null,
    files: Array<Express.Multer.File> | null,
    res: Response,
  ): Promise<EmailTemplate> {
    const newAttachments = [];

    if (attachments && attachments.length) {
      // process attachments from record
      for (const recordID of attachments) {
        // No record
        if (
          !(await this.recordRepo.count({
            where: {
              id: recordID,
              organisation: this.localService.getOrganisation(res).id,
            },
          }))
        )
          continue;

        // Already exists as an attachment
        if (
          await this.emailAttachmentRepo.count({
            where: { recordId: recordID, emailTemplate: template },
          })
        )
          continue;

        // Save new emailAttachment
        newAttachments.push(
          this.emailAttachmentRepo.create({
            recordId: recordID,
            emailTemplate: template,
          }),
        );
      }
    }

    if (files && files.length) {
      // Upload files
      if (files && files.length) {
        const uploadedFiles = await this.recordService.uploadFiles(res, files);
        for (const record of uploadedFiles.records) {
          newAttachments.push(
            this.emailAttachmentRepo.create({
              recordId: record.id,
              emailTemplate: template,
            }),
          );
        }
      }
    }

    // Attach the attachments
    if (Array.isArray(template.attachments)) {
      template.attachments = template.attachments.concat(
        await this.emailAttachmentRepo.save(newAttachments),
      );
    } else {
      template.attachments = await this.emailAttachmentRepo.save(
        newAttachments,
      );
    }
    return template;
  }
}
