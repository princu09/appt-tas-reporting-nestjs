import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { User } from 'src/auto-resources/user/user.entity';
import {
  DynamicFormService,
  QuestionType,
  Section,
} from 'src/dynamic-form/dynamic-form.service';
import { LanguageCodeType } from 'src/dynamic-form/language-codes';
import { LocalsService } from 'src/services/locals/locals.service';
import { DeepPartial, Repository } from 'typeorm';
import { OrganisationContractorService } from '../organisation-contractor/organisation-contractor.service';
import { LostTimeReport } from './lost-time-report.entity';

@Injectable()
export class LostTimeReportService extends TypeOrmCrudService<LostTimeReport> {
  constructor(
    @InjectRepository(LostTimeReport) public repo: Repository<LostTimeReport>,
    @InjectRepository(User) public userRepo: Repository<User>,
    public orgContractorService: OrganisationContractorService,
    private locals: LocalsService,
    private formService: DynamicFormService,
  ) {
    super(repo);
  }

  async createOneOverride(res: Response, dto: DeepPartial<LostTimeReport>) {
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

  async getForm(
    data: LostTimeReport = null,
    languageCode: LanguageCodeType = 'English',
  ) {
    return this.formService.newForm(
      [
        new Section(
          [
            this.formService
              .createQuestion()
              .setName<LostTimeReport>('numLostHoursPerWeekRain')
              .setQuestionText('Number of Lost-Hours: Rain ?')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>('numLostHoursPerWeekStorm')
              .setQuestionText('Number of Lost-Hours: Storm ?')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>('numLostHoursPerWeekHighWinds')
              .setQuestionText('Number of Lost-Hours: High Winds ?')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>(
                'numLostHoursPerWeekHeatColdStressManagement',
              )
              .setQuestionText(
                'Number of Lost-Hours: Heat or Cold Stress Management ?',
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>('numLostHoursPerWeekCOVID19')
              .setQuestionText('Number of Lost-Hours: COVID-19 ?')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>(
                'numLostHoursPerWeekPowerCutsAndInterruptions',
              )
              .setQuestionText(
                'Number of Lost-Hours: Power Cuts / Interruptions ?',
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>('numLostHoursPerWeekUnionStoppages')
              .setQuestionText('Number of Lost-Hours: Union Stoppages ?')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>(
                'numLostHoursPerWeekPermitToWorkAuthorizations',
              )
              .setQuestionText(
                'Number of Lost-Hours: Permit to Work Authorizations ?',
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<LostTimeReport>('numLostHoursPerWeekPlantStoppages')
              .setQuestionText('Number of Lost-Hours: Plant Stoppages ?')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of Lost-Hours',
        ),
        new Section([
          this.formService
            .createQuestion()
            .setName<LostTimeReport>('signature')
            .setQuestionText('Signature')
            .setQuestionType(QuestionType.SIGNATURE)
            .isRequired(),
        ]),
      ],
      '/lost-time-report',
      '/lost-time-report',
      data,
      languageCode,
    );
  }
}
