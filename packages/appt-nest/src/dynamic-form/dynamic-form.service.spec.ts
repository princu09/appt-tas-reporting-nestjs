import {
  DynamicFormService,
  GoTo,
  GoToEvaluator,
  QuestionType,
  Section,
} from './dynamic-form.service';

describe('DynamicFormBuilder', () => {
  it('form1Questions', () => {
    const formBuilder = new DynamicFormService();
    const form = formBuilder.newForm(
      [
        new Section([
          formBuilder
            .createQuestion()
            .setName('firstTest')
            .setReturnApiStructure(['test'])
            .setQuestionText('questionText')
            .setQuestionType(QuestionType.DATE)
            .isRequired(),
        ]),
      ],
      '/test',
      '/test',
    );
    expect(form).toMatchObject({
      postPath: '/test',
      patchPath: '/test',
      data: [
        {
          questions: [
            {
              questionId: 1,
              returnAPIName: 'firstTest',
              returnAPIStructure: ['test'],
              questionText: 'questionText',
              questionType: 'DATE',
              required: true,
            },
          ],
        },
      ],
    });
  });

  it('form1QuestionsTree', () => {
    const formBuilder = new DynamicFormService();
    const form = formBuilder.newForm(
      [
        new Section([
          formBuilder
            .createQuestion()
            .setName('firstTest')
            .setReturnApiStructure(['test'])
            .setQuestionText('questionText')
            .setQuestionType(QuestionType.DATE)
            .isRequired()
            .setGoTos([
              new GoTo('alex', GoToEvaluator.EQ, [
                new Section([
                  formBuilder
                    .createQuestion()
                    .setName('isAlex')
                    .setQuestionText('Are you an alex ?')
                    .isRequired()
                    .setQuestionType(QuestionType.CHECKBOX),
                ]),
              ]),
            ]),
        ]),
      ],
      '/test',
      '/test',
    );

    expect(form).toEqual({
      postPath: '/test',
      patchPath: '/test',
      data: [
        {
          questions: [
            {
              questionId: 1,
              returnAPIName: 'firstTest',
              returnAPIStructure: ['test'],
              questionText: 'questionText',
              questionType: 'DATE',
              required: true,
              goTos: [
                {
                  value: 'alex',
                  evaluator: '=',
                  sections: [
                    {
                      questions: [
                        {
                          questionId: 2,
                          returnAPIName: 'isAlex',
                          questionText: 'Are you an alex ?',
                          required: true,
                          questionType: 'CHECKBOX',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('fullForm', () => {
    const formBuilder = new DynamicFormService();

    const over30sQuestions = (builder: DynamicFormService) => {
      return [
        new Section([
          builder
            .createQuestion()
            .setName('over30Insurance')
            .setReturnApiStructure(['user', 'insurance30'])
            .setQuestionText('Do you want over 30s insurance ?')
            .setQuestionType(QuestionType.CHECKBOX)
            .isRequired()
            .setGoTos([
              new GoTo('true', GoToEvaluator.EQ, [
                new Section([
                  builder
                    .createQuestion()
                    .setName('insuranceAmount')
                    .setReturnApiStructure(['insuranceData'])
                    .setQuestionText('How much money do you need ?')
                    .setQuestionType(QuestionType.MONEY)
                    .isRequired(),
                ]),
                new Section([
                  builder
                    .createQuestion()
                    .setName('insurancePremium')
                    .setReturnApiStructure(['insuranceData'])
                    .setQuestionText('How much do you want to pay ?')
                    .setQuestionType(QuestionType.MONEY)
                    .isRequired(),

                  builder
                    .createQuestion()
                    .setName('paymentDate')
                    .setReturnApiStructure(['insuranceData'])
                    .setQuestionText('When do you want to pay ?')
                    .setQuestionType(QuestionType.DATE)
                    .isRequired(),

                  builder
                    .createQuestion()
                    .setQuestionText('When does your home insurance end')
                    .setQuestionType(QuestionType.DATE)
                    .setGoTos([
                      new GoTo('2022-11-01T13:39:14.695Z', GoToEvaluator.GT, [
                        new Section([
                          builder
                            .createQuestion()
                            .setName('renewWithUs')
                            .setReturnApiStructure(['homeinsurance'])
                            .setQuestionText('Do you want to renew with us ?')
                            .setQuestionType(QuestionType.CHECKBOX),
                        ]),
                      ]),
                    ]),
                ]),
              ]),
            ]),
        ]),
      ];
    };

    const form = formBuilder.newForm(
      [
        new Section([
          formBuilder
            .createQuestion()
            .setName('firstname')
            .setQuestionType(QuestionType.PLAINTEXT)
            .setQuestionText('What is your first name')
            .setReturnApiStructure(['user'])
            .isRequired(),
          formBuilder
            .createQuestion()
            .setName('lastname')
            .setQuestionType(QuestionType.PLAINTEXT)
            .setQuestionText('What is your last name')
            .setReturnApiStructure(['user'])
            .isRequired(),
          formBuilder
            .createQuestion()
            .setName('dob')
            .setQuestionType(QuestionType.DATE)
            .setQuestionText('What is your DOB')
            .setReturnApiStructure(['user'])
            .isRequired()
            .setGoTos([
              new GoTo(
                '1990/01/01',
                GoToEvaluator.LSE,
                over30sQuestions(formBuilder),
              ),
            ]),
        ]),
      ],
      '/test',
      '/test',
    );

    expect(form).toEqual({
      postPath: '/test',
      patchPath: '/test',
      data: [
        {
          questions: [
            {
              questionId: 1,
              returnAPIName: 'firstname',
              questionType: 'PLAINTEXT',
              questionText: 'What is your first name',
              returnAPIStructure: ['user'],
              required: true,
            },
            {
              questionId: 2,
              returnAPIName: 'lastname',
              questionType: 'PLAINTEXT',
              questionText: 'What is your last name',
              returnAPIStructure: ['user'],
              required: true,
            },
            {
              questionId: 3,
              returnAPIName: 'dob',
              questionType: 'DATE',
              questionText: 'What is your DOB',
              returnAPIStructure: ['user'],
              required: true,
              goTos: [
                {
                  value: '1990/01/01',
                  evaluator: '<=',
                  sections: [
                    {
                      questions: [
                        {
                          questionId: 4,
                          returnAPIName: 'over30Insurance',
                          returnAPIStructure: ['user', 'insurance30'],
                          questionText: 'Do you want over 30s insurance ?',
                          questionType: 'CHECKBOX',
                          required: true,
                          goTos: [
                            {
                              value: 'true',
                              evaluator: '=',
                              sections: [
                                {
                                  questions: [
                                    {
                                      questionId: 5,
                                      returnAPIName: 'insuranceAmount',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText:
                                        'How much money do you need ?',
                                      questionType: 'MONEY',
                                      required: true,
                                    },
                                  ],
                                },
                                {
                                  questions: [
                                    {
                                      questionId: 6,
                                      returnAPIName: 'insurancePremium',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText:
                                        'How much do you want to pay ?',
                                      questionType: 'MONEY',
                                      required: true,
                                    },
                                    {
                                      questionId: 7,
                                      returnAPIName: 'paymentDate',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText: 'When do you want to pay ?',
                                      questionType: 'DATE',
                                      required: true,
                                    },
                                    {
                                      questionId: 8,
                                      questionText:
                                        'When does your home insurance end',
                                      questionType: 'DATE',
                                      goTos: [
                                        {
                                          value: '2022-11-01T13:39:14.695Z',
                                          evaluator: '>',
                                          sections: [
                                            {
                                              questions: [
                                                {
                                                  questionId: 9,
                                                  returnAPIName: 'renewWithUs',
                                                  returnAPIStructure: [
                                                    'homeinsurance',
                                                  ],
                                                  questionText:
                                                    'Do you want to renew with us ?',
                                                  questionType: 'CHECKBOX',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('fullFormWith Values', () => {
    const formBuilder = new DynamicFormService();

    const over30sQuestions = (builder: DynamicFormService) => {
      return new Section([
        builder
          .createQuestion()
          .setName('over30Insurance')
          .setReturnApiStructure(['user', 'insurance30'])
          .setQuestionText('Do you want over 30s insurance ?')
          .setQuestionType(QuestionType.CHECKBOX)
          .isRequired()
          .setGoTos([
            new GoTo('true', GoToEvaluator.EQ, [
              new Section([
                builder
                  .createQuestion()
                  .setName('insuranceAmount')
                  .setReturnApiStructure(['insuranceData'])
                  .setQuestionText('How much money do you need ?')
                  .setQuestionType(QuestionType.MONEY)
                  .isRequired(),

                builder
                  .createQuestion()
                  .setName('insurancePremium')
                  .setReturnApiStructure(['insuranceData'])
                  .setQuestionText('How much do you want to pay ?')
                  .setQuestionType(QuestionType.MONEY)
                  .isRequired(),

                builder
                  .createQuestion()
                  .setName('paymentDate')
                  .setReturnApiStructure(['insuranceData'])
                  .setQuestionText('When do you want to pay ?')
                  .setQuestionType(QuestionType.DATE)
                  .isRequired(),

                builder
                  .createQuestion()
                  .setQuestionText('When does your home insurance end')
                  .setName('insuranceEnd')
                  .setQuestionType(QuestionType.DATE)
                  .setGoTos([
                    new GoTo('2022-11-01T13:39:14.695Z', GoToEvaluator.GT, [
                      new Section([
                        builder
                          .createQuestion()
                          .setName('renewWithUs')
                          .setReturnApiStructure(['homeinsurance'])
                          .setQuestionText('Do you want to renew with us ?')
                          .setQuestionType(QuestionType.CHECKBOX),
                        builder
                          .createQuestion()
                          .setName('tester')
                          .setReturnApiStructure(['homeinsurance'])
                          .setQuestionText('Do you want to renew with us ?')
                          .setQuestionType(QuestionType.CHECKBOX),
                        builder
                          .createQuestion()
                          .setQuestionText(
                            'Do you want to renew with us ? tester 2',
                          )
                          .setQuestionType(QuestionType.CHECKBOX),
                      ]),
                    ]),
                  ]),
              ]),
            ]),
          ]),
      ]);
    };

    const form = formBuilder.newForm(
      [
        new Section([
          formBuilder
            .createQuestion()
            .setName('firstname')
            .setQuestionType(QuestionType.PLAINTEXT)
            .setQuestionText('What is your first name')
            .setReturnApiStructure(['user'])
            .isRequired(),
          formBuilder
            .createQuestion()
            .setName('lastname')
            .setQuestionType(QuestionType.PLAINTEXT)
            .setQuestionText('What is your last name')
            .setReturnApiStructure(['user'])
            .isRequired(),
          formBuilder
            .createQuestion()
            .setName('dob')
            .setQuestionType(QuestionType.DATE)
            .setQuestionText('What is your DOB')
            .setReturnApiStructure(['user'])
            .isRequired()
            .setGoTos([
              new GoTo('1990/01/01', GoToEvaluator.LSE, [
                over30sQuestions(formBuilder),
              ]),
            ]),
        ]),
      ],
      '/test',
      '/test',
      {
        user: {
          firstname: 'Alex',
          lastname: 'Taylor',
          ignoreMe: '',
          dob: '07/06/1980',
          insurance30: {
            over30Insurance: true,
          },
        },
        insuranceData: {
          insuranceAmount: '200000.01',
          insurancePremium: '20.50',
          paymentDate: '01/01/2000',
        },
        homeinsurance: {
          renewWithUs: true,
        },
        insuranceEnd: '01/01/2023',
      },
    );

    expect(form).toEqual({
      postPath: '/test',
      patchPath: '/test',
      data: [
        {
          questions: [
            {
              questionId: 1,
              returnAPIName: 'firstname',
              questionType: 'PLAINTEXT',
              questionText: 'What is your first name',
              returnAPIStructure: ['user'],
              required: true,
              value: 'Alex',
            },
            {
              questionId: 2,
              returnAPIName: 'lastname',
              questionType: 'PLAINTEXT',
              questionText: 'What is your last name',
              returnAPIStructure: ['user'],
              required: true,
              value: 'Taylor',
            },
            {
              questionId: 3,
              returnAPIName: 'dob',
              questionType: 'DATE',
              questionText: 'What is your DOB',
              returnAPIStructure: ['user'],
              required: true,
              goTos: [
                {
                  value: '1990/01/01',
                  evaluator: '<=',
                  sections: [
                    {
                      questions: [
                        {
                          questionId: 4,
                          returnAPIName: 'over30Insurance',
                          returnAPIStructure: ['user', 'insurance30'],
                          questionText: 'Do you want over 30s insurance ?',
                          questionType: 'CHECKBOX',
                          required: true,
                          goTos: [
                            {
                              value: 'true',
                              evaluator: '=',
                              sections: [
                                {
                                  questions: [
                                    {
                                      questionId: 5,
                                      returnAPIName: 'insuranceAmount',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText:
                                        'How much money do you need ?',
                                      questionType: 'MONEY',
                                      required: true,
                                      value: '200000.01',
                                    },
                                    {
                                      questionId: 6,
                                      returnAPIName: 'insurancePremium',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText:
                                        'How much do you want to pay ?',
                                      questionType: 'MONEY',
                                      required: true,
                                      value: '20.50',
                                    },
                                    {
                                      questionId: 7,
                                      returnAPIName: 'paymentDate',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText: 'When do you want to pay ?',
                                      questionType: 'DATE',
                                      required: true,
                                      value: '01/01/2000',
                                    },
                                    {
                                      questionId: 8,
                                      questionText:
                                        'When does your home insurance end',
                                      returnAPIName: 'insuranceEnd',
                                      questionType: 'DATE',
                                      goTos: [
                                        {
                                          value: '2022-11-01T13:39:14.695Z',
                                          evaluator: '>',
                                          sections: [
                                            {
                                              questions: [
                                                {
                                                  questionId: 9,
                                                  returnAPIName: 'renewWithUs',
                                                  returnAPIStructure: [
                                                    'homeinsurance',
                                                  ],
                                                  questionText:
                                                    'Do you want to renew with us ?',
                                                  questionType: 'CHECKBOX',
                                                  value: true,
                                                },
                                                {
                                                  questionId: 10,
                                                  returnAPIName: 'tester',
                                                  returnAPIStructure: [
                                                    'homeinsurance',
                                                  ],
                                                  questionText:
                                                    'Do you want to renew with us ?',
                                                  questionType: 'CHECKBOX',
                                                },
                                                {
                                                  questionId: 11,
                                                  questionText:
                                                    'Do you want to renew with us ? tester 2',
                                                  questionType: 'CHECKBOX',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                      value: '01/01/2023',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                          value: true,
                        },
                      ],
                    },
                  ],
                },
              ],
              value: '07/06/1980',
            },
          ],
        },
      ],
    });
  });

  it('fullFormWith Values Data Mixup', () => {
    const formBuilder = new DynamicFormService();

    const over30sQuestions = (builder: DynamicFormService) => {
      return new Section([
        builder
          .createQuestion()
          .setName('over30Insurance')
          .setReturnApiStructure(['user', 'insurance30'])
          .setQuestionText('Do you want over 30s insurance ?')
          .setQuestionType(QuestionType.CHECKBOX)
          .isRequired()
          .setGoTos([
            new GoTo('true', GoToEvaluator.EQ, [
              new Section([
                builder
                  .createQuestion()
                  .setName('insuranceAmount')
                  .setReturnApiStructure(['insuranceData'])
                  .setQuestionText('How much money do you need ?')
                  .setQuestionType(QuestionType.MONEY)
                  .isRequired(),

                builder
                  .createQuestion()
                  .setName('insurancePremium')
                  .setReturnApiStructure(['insuranceData'])
                  .setQuestionText('How much do you want to pay ?')
                  .setQuestionType(QuestionType.MONEY)
                  .isRequired(),

                builder
                  .createQuestion()
                  .setName('paymentDate')
                  .setReturnApiStructure(['insuranceData'])
                  .setQuestionText('When do you want to pay ?')
                  .setQuestionType(QuestionType.DATE)
                  .isRequired(),

                builder
                  .createQuestion()
                  .setQuestionText('When does your home insurance end')
                  .setName('insuranceEnd')
                  .setQuestionType(QuestionType.DATE)
                  .setGoTos([
                    new GoTo('2022-11-01T13:39:14.695Z', GoToEvaluator.GT, [
                      new Section([
                        builder
                          .createQuestion()
                          .setName('renewWithUs')
                          .setReturnApiStructure(['homeinsurance'])
                          .setQuestionText('Do you want to renew with us ?')
                          .setQuestionType(QuestionType.CHECKBOX),
                        builder
                          .createQuestion()
                          .setName('tester')
                          .setReturnApiStructure(['homeinsurance'])
                          .setQuestionText('Do you want to renew with us ?')
                          .setQuestionType(QuestionType.CHECKBOX),
                        builder
                          .createQuestion()
                          .setQuestionText(
                            'Do you want to renew with us ? tester 2',
                          )
                          .setQuestionType(QuestionType.CHECKBOX),
                      ]),
                    ]),
                  ]),
              ]),
            ]),
          ]),
      ]);
    };

    const form = formBuilder.newForm(
      [
        new Section([
          formBuilder
            .createQuestion()
            .setName('firstname')
            .setQuestionType(QuestionType.PLAINTEXT)
            .setQuestionText('What is your first name')
            .setReturnApiStructure(['user'])
            .isRequired(),
          formBuilder
            .createQuestion()
            .setName('lastname')
            .setQuestionType(QuestionType.PLAINTEXT)
            .setQuestionText('What is your last name')
            .setReturnApiStructure(['user'])
            .isRequired(),
          formBuilder
            .createQuestion()
            .setName('dob')
            .setQuestionType(QuestionType.DATE)
            .setQuestionText('What is your DOB')
            .setReturnApiStructure(['user'])
            .isRequired()
            .setGoTos([
              new GoTo('1990/01/01', GoToEvaluator.LSE, [
                over30sQuestions(formBuilder),
              ]),
            ]),
        ]),
      ],
      '/test',
      '/test',
      {
        ignoreMe: '',
        homeinsurance: {
          ignoreMe: '',
          insuranceEnd: '01/01/2023',
          renewWithUs: true,
        },
        insuranceEnd: '01/01/2023',
        adasdasdad: '',
        renewWithUs: true,
        lastname: 'Taylor',
        insuranceData: {
          ignoreMe: '',
          insurancePremium: '20.50',
          insuranceAmount: '200000.01',
          hadhashdahsdh: '',
          paymentDate: '01/01/2000',
          asdjasjda: '',
          lastname: 'Taylor',
        },
        user: {
          ignoreMe: '',
          insurance30: {
            over30Insurance: true,
            asjdajsd: '',
            ignoreMe: 'true',
            firstname: 'Alex',
          },
          firstname: 'Alex',
          asjdajsd: '',
          dob: '07/06/1980',
          lastname: 'Taylor',
        },
      },
    );

    expect(form).toEqual({
      postPath: '/test',
      patchPath: '/test',
      data: [
        {
          questions: [
            {
              questionId: 1,
              returnAPIName: 'firstname',
              questionType: 'PLAINTEXT',
              questionText: 'What is your first name',
              returnAPIStructure: ['user'],
              required: true,
              value: 'Alex',
            },
            {
              questionId: 2,
              returnAPIName: 'lastname',
              questionType: 'PLAINTEXT',
              questionText: 'What is your last name',
              returnAPIStructure: ['user'],
              required: true,
              value: 'Taylor',
            },
            {
              questionId: 3,
              returnAPIName: 'dob',
              questionType: 'DATE',
              questionText: 'What is your DOB',
              returnAPIStructure: ['user'],
              required: true,
              goTos: [
                {
                  value: '1990/01/01',
                  evaluator: '<=',
                  sections: [
                    {
                      questions: [
                        {
                          questionId: 4,
                          returnAPIName: 'over30Insurance',
                          returnAPIStructure: ['user', 'insurance30'],
                          questionText: 'Do you want over 30s insurance ?',
                          questionType: 'CHECKBOX',
                          required: true,
                          goTos: [
                            {
                              value: 'true',
                              evaluator: '=',
                              sections: [
                                {
                                  questions: [
                                    {
                                      questionId: 5,
                                      returnAPIName: 'insuranceAmount',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText:
                                        'How much money do you need ?',
                                      questionType: 'MONEY',
                                      required: true,
                                      value: '200000.01',
                                    },
                                    {
                                      questionId: 6,
                                      returnAPIName: 'insurancePremium',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText:
                                        'How much do you want to pay ?',
                                      questionType: 'MONEY',
                                      required: true,
                                      value: '20.50',
                                    },
                                    {
                                      questionId: 7,
                                      returnAPIName: 'paymentDate',
                                      returnAPIStructure: ['insuranceData'],
                                      questionText: 'When do you want to pay ?',
                                      questionType: 'DATE',
                                      required: true,
                                      value: '01/01/2000',
                                    },
                                    {
                                      questionId: 8,
                                      questionText:
                                        'When does your home insurance end',
                                      returnAPIName: 'insuranceEnd',
                                      questionType: 'DATE',
                                      goTos: [
                                        {
                                          value: '2022-11-01T13:39:14.695Z',
                                          evaluator: '>',
                                          sections: [
                                            {
                                              questions: [
                                                {
                                                  questionId: 9,
                                                  returnAPIName: 'renewWithUs',
                                                  returnAPIStructure: [
                                                    'homeinsurance',
                                                  ],
                                                  questionText:
                                                    'Do you want to renew with us ?',
                                                  questionType: 'CHECKBOX',
                                                  value: true,
                                                },
                                                {
                                                  questionId: 10,
                                                  returnAPIName: 'tester',
                                                  returnAPIStructure: [
                                                    'homeinsurance',
                                                  ],
                                                  questionText:
                                                    'Do you want to renew with us ?',
                                                  questionType: 'CHECKBOX',
                                                },
                                                {
                                                  questionId: 11,
                                                  questionText:
                                                    'Do you want to renew with us ? tester 2',
                                                  questionType: 'CHECKBOX',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                      value: '01/01/2023',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                          value: true,
                        },
                      ],
                    },
                  ],
                },
              ],
              value: '07/06/1980',
            },
          ],
        },
      ],
    });
  });
});
