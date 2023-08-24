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
import {
  ContractorDataReport,
  ContractorDataReportDTO,
} from './contractor-data-report.entity';

@Injectable()
export class ContractorDataReportService extends TypeOrmCrudService<ContractorDataReport> {
  constructor(
    @InjectRepository(ContractorDataReport)
    public repo: Repository<ContractorDataReport>,
    @InjectRepository(User) public userRepo: Repository<User>,
    public orgContractorService: OrganisationContractorService,
    private locals: LocalsService,
    private formService: DynamicFormService,
  ) {
    super(repo);
  }

  async createOneOverride(
    res: Response,
    dto: DeepPartial<ContractorDataReport>,
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

    // Average out the 7 days worker
    const realDTO = dto as ContractorDataReportDTO;
    let workerAvg =
      realDTO?.numOfWorkers1 +
      realDTO?.numOfWorkers2 +
      realDTO?.numOfWorkers3 +
      realDTO?.numOfWorkers4 +
      realDTO?.numOfWorkers5 +
      realDTO?.numOfWorkers6 +
      realDTO?.numOfWorkers7;
    if (workerAvg > 0) {
      workerAvg = workerAvg / 7;
    }

    return await this.repo.save({
      ...dto,
      ...(workerAvg && { numOfWorkers: workerAvg }),
      ...(contractor && { contractor: contractor }),
    });
  }

  async getForm(
    data: ContractorDataReport = null,
    languageCode: LanguageCodeType = 'English',
  ) {
    return this.formService.newForm(
      [
        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('weeklyWorkedHours')
              .setQuestionText('Input number of weekly hours worked')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          `Weekly worked hours`,
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers1')
              .setQuestionText('Monday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers2')
              .setQuestionText('Tuesday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers3')
              .setQuestionText('Wednesday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers4')
              .setQuestionText('Thursday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers5')
              .setQuestionText('Friday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers6')
              .setQuestionText('Saturday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName<ContractorDataReportDTO>('numOfWorkers7')
              .setQuestionText('Sunday')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          `Number of workers`,
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numOfPropertyDamagedEvents')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of events resulting in property damage ?',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numNearMisses')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of near misses',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numFirstAidInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of First Aid Injuries ?',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('medicalTreatmentInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Medical treatment injuries',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numRestrictedWorkCase')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of restricted work cases',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numLostDays')
              .setQuestionText(
                'Input total number of days lost this week due to injuries or ill health of personnel',
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of lost days',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numLostTimeInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of lost time injuries (LTI)',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numDeaths')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of Fatalities ?',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numRIDDORSpecifiedInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of RIDDOR Specified Injuries',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numRIDDORMajorInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of RIDDOR Major Injuries',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numRIDDORDangerousOccurrences')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of RIDDOR dangerous occurrences',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numRIDDOROccupationalIllnesses')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of RIDDOR occupational illnesses',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numRIDDOR7DayInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of RIDDOR 7 day injuries',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numOSHAJobTransferCases')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of OSHA Job Transfer Cases',
        ),
        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numOSHAJobTransferDays')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of OSHA Job Transfer Days',
        ),
        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numOSHARecordableInjuries')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of OSHA recordable injuries',
        ),
        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numLossConciounessCases')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          'Number of loss of consciousness cases',
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numTier1PSECount')
              .setQuestionText(
                `A Tier 1 process safety event is a catastrophic event that results in multiple fatalities and/or severe environmental or property damage. It is an event that exceeds the facility's design safety features and requires emergency response and extensive media attention. Examples of Tier 1 events may include major explosions, fires, toxic gas releases, or other types of catastrophic incidents that have significant impacts on the surrounding community and environment.`,
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          `Number of Process Safety Tier 1 Events`,
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numTier2PSECount')
              .setQuestionText(
                `A Tier 2 process safety event is a catastrophic event that results in multiple fatalities and/or severe environmental or property damage. It is an event that exceeds the facility's design safety features and requires emergency response and extensive media attention. Examples of Tier 1 events may include major explosions, fires, toxic gas releases, or other types of catastrophic incidents that have significant impacts on the surrounding community and environment.`,
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          `Number of Process Safety Tier 2 Events`,
        ),

        new Section(
          [
            this.formService
              .createQuestion()
              .setName<ContractorDataReport>('numTier3PSECount')
              .setQuestionText(
                `A Tier 3 process safety event is a catastrophic event that results in multiple fatalities and/or severe environmental or property damage. It is an event that exceeds the facility's design safety features and requires emergency response and extensive media attention. Examples of Tier 1 events may include major explosions, fires, toxic gas releases, or other types of catastrophic incidents that have significant impacts on the surrounding community and environment.`,
              )
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
          ],
          `Number of Process Safety Tier 3 Events`,
        ),
      ],
      '/weekly-data-report',
      '/weekly-data-report',
      data,
      languageCode,
    );
  }
}
