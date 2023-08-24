import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RecordService } from 'src/auto-resources/record/record.service';
import {
  DynamicFormService,
  GoTo,
  GoToEvaluator,
  QuestionType,
  Section,
} from 'src/dynamic-form/dynamic-form.service';
import { Repository } from 'typeorm';
import { PizzaMultiChoiceEnum, TestForm } from './test-form.entity';

@Injectable()
export class TestFormService extends TypeOrmCrudService<TestForm> {
  constructor(
    @InjectRepository(TestForm) public repo: Repository<TestForm>,
    private formService: DynamicFormService,
    public recordService: RecordService,
  ) {
    super(repo);
  }

  async parseEntityReturn(entity: TestForm) {
    if (entity.IDPicture) {
      entity.IDPicture = await this.recordService.signURL(entity.IDPicture);
    }
    return entity;
  }

  getDynamicForm(data: TestForm = null) {
    return this.formService.newForm(
      [
        new Section(
          [
            this.formService
              .createQuestion()
              .setName('firstName')
              .setQuestionText('What is your first name ?')
              .setQuestionType(QuestionType.TEXT)
              .isRequired(),

            this.formService
              .createQuestion()
              .setName('lastName')
              .setQuestionText('What is your last name ?')
              .setQuestionType(QuestionType.TEXT)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName('DOB')
              .setQuestionText('What is your date of birth ?')
              .setQuestionType(QuestionType.DATE)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName('IDPicture')
              .setQuestionText('Picture of Drivers licence')
              .setQuestionType(QuestionType.IMAGE_UPLOAD)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName('age')
              .setQuestionText('How old are you ? ')
              .setQuestionType(QuestionType.INTEGER)
              .isRequired(),
            this.formService
              .createQuestion()
              .setName('skipMe')
              .setQuestionText('Skip me please !!!')
              .setQuestionType(QuestionType.INTEGER),
          ],
          'User Details',
        ),
        new Section(
          [
            this.formService
              .createQuestion()
              .setName('ItalianFoodPreference')
              .setQuestionText('What is your Italian food preference ?')
              .setQuestionType(QuestionType.DROPDOWN)
              .setOptions(
                Object.values(PizzaMultiChoiceEnum).map((x) => ({
                  value: x,
                  label: x,
                  description: x,
                })),
              )
              .isRequired(),
            this.formService
              .createQuestion()
              .setName('doYouLikeCheese')
              .setQuestionText('Do you like cheese ?')
              .setQuestionType(QuestionType.BOOLEAN)
              .isRequired()
              .setGoTos([
                new GoTo('true', GoToEvaluator.EQ, [
                  new Section(
                    [
                      this.formService
                        .createQuestion()
                        .setQuestionType(QuestionType.SELECT)
                        .setQuestionText('Pick your cheese!')
                        .setOptions([
                          {
                            value: 'stilton',
                            label: 'stilton',
                            description: 'stilton',
                          },
                          {
                            value: 'cheddar',
                            label: 'cheddar',
                            description: 'cheddar',
                          },
                          {
                            value: "'merican",
                            label: "'merican",
                            description: "'merican",
                          },
                        ]),
                    ],
                    'We all love cheese',
                  ),
                ]),
                new GoTo('false', GoToEvaluator.EQ, [
                  new Section(
                    [
                      this.formService
                        .createQuestion()
                        .setQuestionType(QuestionType.SELECT)
                        .setQuestionText('Why dont you like cheese!')
                        .setOptions([
                          {
                            value: 'lactose intolerant',
                            label: 'lactose intolerant',
                            description: 'lactose intolerant',
                          },
                          {
                            value: 'No over valid reason',
                            label: 'No over valid reason',
                            description: 'No over valid reason',
                          },
                        ]),
                    ],
                    'Why dont you love cheese',
                  ),
                ]),
              ]),
          ],
          'Foods',
        ),
        new Section([
          this.formService
            .createQuestion()
            .setName('aboutYourself')
            .setQuestionText('Tell us about yourself?')
            .setQuestionType(QuestionType.MULTITEXT)
            .isRequired(),
        ]),
        new Section(
          [
            this.formService
              .createQuestion()
              .setName('signed')
              .setQuestionText('Is all the information provided true ?')
              .setQuestionType(QuestionType.SIGNATURE)
              .isRequired(),
          ],
          'User Signature',
        ),
      ],
      '/testform',
      '/testform',
      data,
    );
  }
}
