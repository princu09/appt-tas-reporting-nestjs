import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { RecordService } from 'src/auto-resources/record/record.service';
import { User } from 'src/auto-resources/user/user.entity';
import {
  DynamicFormService,
  QuestionType,
  Section,
} from 'src/dynamic-form/dynamic-form.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { DeepPartial, Repository } from 'typeorm';
import { Area } from '../area/area.entity';
import { OrganisationContractorService } from '../organisation-contractor/organisation-contractor.service';
import { IncidentFlashReport } from './incident-flash-report.entity';
import { LanguageCodeType } from 'src/dynamic-form/language-codes';

@Injectable()
export class IncidentFlashReportService extends TypeOrmCrudService<IncidentFlashReport> {
  constructor(
    @InjectRepository(IncidentFlashReport)
    public repo: Repository<IncidentFlashReport>,
    @InjectRepository(Area) public areaRepo: Repository<Area>,
    @InjectRepository(User) public userRepo: Repository<User>,
    public orgContractorService: OrganisationContractorService,
    private formService: DynamicFormService,
    public recordService: RecordService,
    private locals: LocalsService,
  ) {
    super(repo);
  }

  async createOneOverride(
    res: Response,
    dto: DeepPartial<IncidentFlashReport>,
  ) {
    // get contractor
    const user = await this.userRepo.findOne(this.locals.getUserId(res), {
      relations: ['contractors'],
    });
    let contractor = user.contractors.find(
      (x) => x.organisation === this.locals.getOrganisation(res).id,
    );

    // Get the default for the org
    if (!contractor) {
      contractor = await this.orgContractorService.getDefaultOrgContractor(
        this.locals.getOrganisation(res).id,
      );
    }

    return await this.repo.save({
      ...dto,
      ...(contractor && { contractor: contractor }),
    });
  }

  async parseEntityReturn(entity: IncidentFlashReport) {
    for (let record of entity.picture) {
      record = await this.recordService.signURL(record);
    }

    return entity;
  }

  async getForm(
    res: Response,
    data: IncidentFlashReport = null,
    languageCode: LanguageCodeType = 'English',
  ) {
    const org = this.locals.getOrganisation(res);
    const areas = await this.areaRepo.find({
      organisation: org.id,
    });

    return this.formService.newForm(
      [
        new Section([
          this.formService
            .createQuestion()
            .setQuestionText(
              'The flash report is a preliminary report that provides initial information regarding an adverse event that has occurred. It is to be prepared and issued shortly after an event has occurred. The purpose of the adverse event flash report is to quickly inform relevant parties, such as management.',
            ),
        ]),
        new Section([
          this.formService
            .createQuestion()
            .setName<IncidentFlashReport>('observed')
            .setQuestionText('Date')
            .setQuestionType(QuestionType.DATETIME)
            .setValue(data ? data.observed : new Date())
            .isRequired(),
        ]),
        new Section([
          this.formService
            .createQuestion()
            .setName<IncidentFlashReport>('areaId')
            .setQuestionText('Area')
            .setQuestionType(QuestionType.OBJECT_DROPDOWN)
            .setObjectOptions(areas, 'name')
            .isRequired(),
        ]),
        new Section([
          this.formService
            .createQuestion()
            .setName<IncidentFlashReport>('description')
            .setQuestionText('Description of Event')
            .setQuestionType(QuestionType.MULTITEXT)
            .isRequired(),
        ]),
        new Section([
          this.formService
            .createQuestion()
            .setName<IncidentFlashReport>('picture')
            .setQuestionText('Picture')
            .setQuestionType(QuestionType.IMAGE_UPLOAD)
            .setImageUploadUrl('/incident-flash-report/files/')
            .isRequired(),
        ]),
        new Section([
          this.formService
            .createQuestion()
            .setName<IncidentFlashReport>('signature')
            .setQuestionText('Signature')
            .setQuestionType(QuestionType.SIGNATURE)
            .isRequired(),
        ]),
      ],
      '/incident-flash-report',
      '/incident-flash-report',
      data,
      languageCode,
    );
  }
}
