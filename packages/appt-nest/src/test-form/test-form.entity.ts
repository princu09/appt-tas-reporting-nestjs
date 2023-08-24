import { Record } from '../auto-resources/record/record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApptBaseEntity } from '../base/appt-base-entity';
import { ApptBaseDTO } from '../base/appt-base-dto';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PizzaMultiChoiceEnum {
  ILOVEPIZZA = 'ILOVEPIZZA',
  IHATEPIZZA = 'IHATEPIZZA',
  IPREFFERENCELASGNE = 'IPREFERLASAGNA',
}

export enum PizzaToppings {
  pepperoni = 'pepperoni',
  pineapple = 'pineapple',
  cheese = 'cheese',
}

@Entity('test-form')
export class TestForm extends ApptBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  firstName?: string;

  @Column('text', { nullable: true })
  lastName?: string;

  @Column('date', { nullable: true })
  DOB?: Date;

  @OneToOne(() => Record, { eager: true })
  @JoinColumn()
  IDPicture?: Record | null;

  @Column({
    type: 'enum',
    enum: PizzaMultiChoiceEnum,
    nullable: true,
  })
  ItalianFoodPreference?: PizzaMultiChoiceEnum;

  @Column({
    type: 'enum',
    enum: PizzaToppings,
    nullable: true,
  })
  pizaaTopping?: PizzaToppings;

  @Column('bool', { nullable: true })
  signed?: boolean;

  @Column('bool', { nullable: true })
  doYouLikeCheese?: boolean;

  @Column('int', { nullable: true })
  age?: number;

  @Column('text', { nullable: true })
  aboutYourself?: string;
}

export class TestFormDTO extends ApptBaseDTO {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  DOB?: Date;

  @IsObject()
  @IsOptional()
  IDPicture?: Record;

  @IsOptional()
  @IsEnum(PizzaMultiChoiceEnum)
  ItalianFoodPreference: PizzaMultiChoiceEnum;

  @IsOptional()
  @IsEnum(PizzaToppings)
  pizaaTopping?: PizzaToppings;

  @IsBoolean()
  @IsOptional()
  signed?: boolean;

  @IsBoolean()
  @IsOptional()
  doYouLikeCheese?: boolean;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  aboutYourself?: string;
}
