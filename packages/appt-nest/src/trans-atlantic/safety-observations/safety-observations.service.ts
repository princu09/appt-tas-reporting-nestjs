import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { RecordService } from 'src/auto-resources/record/record.service';
import { User } from 'src/auto-resources/user/user.entity';
import {
  DynamicFormService,
  GoTo,
  GoToEvaluator,
  QuestionType,
  Section,
} from 'src/dynamic-form/dynamic-form.service';
import { LanguageCodeType } from 'src/dynamic-form/language-codes';
import { LocalsService } from 'src/services/locals/locals.service';
import { Repository } from 'typeorm';
import { OrganisationContractorService } from '../organisation-contractor/organisation-contractor.service';
import {
  SafetyObservationCategory,
  SafetyObservationCategoryDescriptions,
  SafetyObservationRiskLevel,
  SafetyObservationRiskLevelDescriptions,
  SafetyObservationSubcategory,
  SafetyObservationUnsafeActOrCondition,
  SafetyObservationUnsafeActOrConditionDescriptions,
  SafetyObservations,
  SafetyObservationsBreachType,
  SafetyObservationsBreachTypeDescriptions,
  SafetyObservationsDTO,
} from './safety-observations.entity';

@Injectable()
export class SafetyObservationsService extends TypeOrmCrudService<SafetyObservations> {
  constructor(
    @InjectRepository(SafetyObservations)
    public repo: Repository<SafetyObservations>,
    @InjectRepository(User) public userRepo: Repository<User>,
    private localsService: LocalsService,
    private formService: DynamicFormService,
    public recordService: RecordService,
    public orgContractorService: OrganisationContractorService,
  ) {
    super(repo);
  }

  async updateOneOverride(id: string, dto: SafetyObservationsDTO) {
    await this.repo.update(id, dto);
    return this.repo.findOne(id);
  }

  async parseEntityReturn(entity: SafetyObservations) {
    for (let record of entity.photoEvidence) {
      record = await this.recordService.signURL(record);
    }

    for (let record of entity.photoEvidenceClosure) {
      record = await this.recordService.signURL(record);
    }

    return entity;
  }

  async getOpeningFormQuestions(res: Response) {
    const contractorOrgs = await this.orgContractorService.find({
      organisation: this.localsService.getOrganisation(res).id,
    });

    return [
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('dateObserved')
          .setQuestionText('Date')
          .setQuestionType(QuestionType.DATE)
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('contractorId')
          .setQuestionText('Contractor')
          .setQuestionType(QuestionType.DROPDOWN)
          .setOptions(
            contractorOrgs.map((x) => {
              return {
                value: x.id,
                label: x.name,
                description: x.name,
              };
            }),
          )
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('observation')
          .setQuestionText('Observation')
          .setQuestionType(QuestionType.MULTITEXT)
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('photoEvidence')
          .setQuestionText('Photo evidence')
          .setQuestionType(QuestionType.IMAGE_UPLOAD)
          .setImageUploadUrl('/safety-observations/files/')
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('riskLevel')
          .setQuestionText('Risk Level')
          .setQuestionType(QuestionType.OPTION)
          .setOptions(
            Object.values(SafetyObservationRiskLevel).map((x) => ({
              value: x,
              label: x,
              description: SafetyObservationRiskLevelDescriptions[x],
            })),
          )
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('category')
          .setQuestionText('Category')
          .setQuestionType(QuestionType.OPTION)
          .setOptions(
            Object.values(SafetyObservationCategory).map((x) => ({
              value: x,
              label: x,
              description: SafetyObservationCategoryDescriptions[x],
            })),
          )
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('subcategory')
          .setQuestionText('Sub-Category')
          .setQuestionType(QuestionType.DROPDOWN)
          .setOptions(
            Object.values(SafetyObservationSubcategory).map((x) => ({
              value: x,
              label: x,
              description: x,
            })),
          )
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('breachType')
          .setQuestionText('Breach Type (Regulatory or project Plan)')
          .setQuestionType(QuestionType.OPTION)
          .setOptions(
            Object.values(SafetyObservationsBreachType).map((x) => ({
              value: x,
              label: x,
              description: SafetyObservationsBreachTypeDescriptions[x],
            })),
          )
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('requiredAction')
          .setQuestionText('Required Action')
          .setQuestionType(QuestionType.MULTITEXT)
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('unsafeActOrCondition')
          .setQuestionText('Unsafe Act or Condition')
          .setQuestionType(QuestionType.OPTION)
          .setOptions(
            Object.values(SafetyObservationUnsafeActOrCondition).map((x) => ({
              value: x,
              label: x,
              description: SafetyObservationUnsafeActOrConditionDescriptions[x],
            })),
          )
          .isRequired(),
      ]),
    ];
  }

  async getDynamicFormOpening(
    res: Response,
    data: SafetyObservations = null,
    languageCode: LanguageCodeType = 'English',
  ) {
    return this.formService.newForm(
      [
        ...(await this.getOpeningFormQuestions(res)),
        new Section([
          this.formService
            .createQuestion()
            .setQuestionText('Has this observation already been closed ?')
            .setQuestionType(QuestionType.BOOLEAN)
            .isRequired()
            .setGoTos([
              new GoTo('true', GoToEvaluator.EQ, this.getClosingQuestions()),
              new GoTo('false', GoToEvaluator.EQ, [
                new Section([
                  this.formService
                    .createQuestion()
                    .setName<SafetyObservations>('signature')
                    .setQuestionText('Signature')
                    .setQuestionType(QuestionType.SIGNATURE)
                    .isRequired(),
                ]),
              ]),
            ]),
        ]),
      ],
      '/safety-observations',
      '/safety-observations',
      data,
      languageCode,
    );
  }

  getClosingQuestions() {
    return [
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('actionTaken')
          .setQuestionText('Action Taken')
          .setQuestionType(QuestionType.MULTITEXT)
          .isRequired(),
      ]),
      new Section([
        this.formService
          .createQuestion()
          .setName<SafetyObservations>('photoEvidenceClosure')
          .setQuestionText('Photo Evidence of Closure')
          .setQuestionType(QuestionType.IMAGE_UPLOAD)
          .setImageUploadUrl('/safety-observations/files/')
          .isRequired(),
      ]),
      new Section(
        [
          this.formService
            .createQuestion()
            .setName<SafetyObservations>('closingSignature')
            .setQuestionText('Signature')
            .setQuestionType(QuestionType.SIGNATURE)
            .isRequired(),
        ],
        'Signature',
      ),
    ];
  }

  async getDynamicFormClosing(
    res: Response,
    data: SafetyObservations = null,
    languageCode: LanguageCodeType = 'English',
  ) {
    // Get opening part of the dyanmic form
    const readOnlyFormParts = await this.getOpeningFormQuestions(res);

    // Set them all to read only
    for (const section of readOnlyFormParts) {
      for (const question of section.questions) {
        question.setReadOnly(true);
      }
    }

    return this.formService.newForm(
      [...readOnlyFormParts, ...this.getClosingQuestions()],
      '/safety-observations',
      '/safety-observations',
      data,
      languageCode,
    );
  }
}
