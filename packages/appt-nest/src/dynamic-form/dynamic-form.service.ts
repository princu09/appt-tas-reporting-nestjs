import { Injectable } from '@nestjs/common';
import { findTranslation } from 'src/trans-atlantic/formTranslations';
import { LanguageCodeType } from './language-codes';

export enum QuestionType {
  DATE = 'DATE',
  INTEGER = 'INTEGER',
  TEXT = 'TEXT',
  MULTITEXT = 'MULTITEXT',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  DROPDOWN = 'DROPDOWN',
  OBJECT_DROPDOWN = 'OBJECT_DROPDOWN',
  BOOLEAN = 'BOOLEAN',
  CHECKBOX = 'CHECKBOX',
  OPTION = 'OPTION',
  PLAINTEXT = 'PLAINTEXT',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  MONEY = 'MONEY',
  SIGNATURE = 'SIGNATURE',
  IMAGE_UPLOAD = 'IMAGE_UPLOAD',
}

export enum GoToEvaluator {
  GT = '>',
  GTE = '>=',
  LS = '<',
  LSE = '<=',
  EQ = '=',
  NEQ = '!=',
}

export type Option = {
  value: string;
  label: string;
  description: string;
};

export class GoTo {
  constructor(
    public value: string,
    public evaluator: GoToEvaluator,
    public sections: Section[],
  ) {}
}

export class Section {
  constructor(
    public questions: QuestionConfig[],
    public sectionName?: string,
  ) {}
}

class QuestionConfig {
  public questionId: number;
  public returnAPIName: string;
  public section: string;
  public questionText: string;
  public questionType: QuestionType;
  public required: boolean;
  public error: string;
  public goTos: GoTo[];
  public label: string;
  public returnAPIStructure: string[];
  public options: Option[];
  public objects: any[];
  public objectMapValue: string;
  public objectIDValue: string;
  public value: any;
  public imageUploadUrl: string;
  public readOnly: boolean;

  constructor(q: number) {
    this.questionId = q;
  }

  setReadOnly(b: boolean) {
    this.readOnly = b;
    return this;
  }

  setImageUploadUrl(s: string) {
    this.imageUploadUrl = s;
    return this;
  }

  setObjectOptions(objects: any[], mapValue: string, idValue = 'id') {
    this.objects = objects;
    this.objectMapValue = mapValue;
    this.objectIDValue = idValue;
    return this;
  }

  setValue(o: any) {
    this.value = o;
    return this;
  }

  setOptions(o: Option[]) {
    this.options = o;
    return this;
  }

  setReturnApiStructure(struct: string[]) {
    this.returnAPIStructure = struct;
    return this;
  }

  setLabel(lab: string) {
    this.label = lab;
    return this;
  }

  setName<type>(name: keyof type) {
    this.returnAPIName = name as string;
    return this;
  }

  isRequired() {
    this.required = true;
    return this;
  }

  setSection(s: string) {
    this.section = s;
    return this;
  }

  setQuestionText(q: string) {
    this.questionText = q;
    return this;
  }

  setQuestionType(q: QuestionType) {
    this.questionType = q;
    return this;
  }

  errorMessage(e: string) {
    this.error = e;
    return this;
  }

  setGoTos(a: GoTo[]) {
    this.goTos = a;
    return this;
  }
}

export interface DynamicForm {
  postPath: string;
  patchPath: string;
  data: Section[];
}

@Injectable()
export class DynamicFormService {
  protected count = 0;

  createQuestion() {
    return new QuestionConfig(++this.count);
  }

  translate(data: Section[], languageCode: LanguageCodeType = 'English') {
    for (const section of data) {
      section.sectionName = findTranslation(section.sectionName, languageCode);
      for (const question of section.questions) {
        question.label = findTranslation(question.label, languageCode);
        question.questionText = findTranslation(
          question.questionText,
          languageCode,
        );
        question.section = findTranslation(question.section, languageCode);
        if (question.options) {
          for (const option of question.options) {
            option.label = findTranslation(option.label, languageCode);
            option.description = findTranslation(
              option.description,
              languageCode,
            );
          }
        }

        // Translate the go tos aswell
        if (question?.goTos) {
          for (const goto of question?.goTos) {
            this.translate(goto.sections, languageCode);
          }
        }
      }
    }

    return data;
  }

  newForm(
    data: Section[],
    postPath: string,
    patchPath: string,
    existingData: any = null,
    languageCode: LanguageCodeType = 'English',
  ): DynamicForm {
    const deepFind = (
      data: Section[],
      search: (arg0: QuestionConfig) => boolean,
    ) => {
      for (const section of data) {
        const found = questionTraverse(section.questions, search);
        if (found) return found;
      }
    };

    const questionTraverse = (
      data: QuestionConfig[],
      search: (arg0: QuestionConfig) => boolean,
    ) => {
      const found = data.find(search);
      if (!found) {
        for (const question of data) {
          if (question.goTos?.length) {
            for (const goto of question.goTos) {
              return deepFind(goto.sections, search);
            }
          }
        }
      }
      return found;
    };

    const traverseData = (
      object: Record<string, unknown>,
      structurePath: string[],
    ) => {
      for (const [key, value] of Object.entries(object)) {
        if (
          typeof value === 'object' &&
          value !== null &&
          typeof value !== 'string' &&
          !(value instanceof Date)
        ) {
          structurePath.push(key);
          traverseData(value as Record<string, unknown>, structurePath);
        } else {
          deepFind(
            data,
            (x) =>
              x.returnAPIName === key &&
              (!x.returnAPIStructure ||
                JSON.stringify(x.returnAPIStructure) ===
                  JSON.stringify(structurePath)),
          )?.setValue(value);
        }
      }

      if (structurePath.length) structurePath.pop();
    };

    if (existingData) {
      traverseData(existingData, []);
    }

    return {
      postPath,
      patchPath,
      data: this.translate(data, languageCode),
    };
  }
}

export interface existingForm<Entity> {
  form: string;
  data: Entity;
}

export abstract class DyamicFormController<Entity> {
  abstract post<DTO>(post: DTO): Promise<Entity>;
  abstract patch<DTO>(id: string, patch: DTO): Promise<Entity>;
  abstract getExisting(id: string): Promise<existingForm<Entity>>;
}
