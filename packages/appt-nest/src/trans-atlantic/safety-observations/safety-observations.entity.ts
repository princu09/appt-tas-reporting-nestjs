import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Record } from '../../auto-resources/record/record.entity';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';

export enum SafetyObservationRiskLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  GOOD_PRACTICE = 'Good Practice',
}

export const SafetyObservationRiskLevelDescriptions: {
  [key in typeof SafetyObservationRiskLevel[keyof typeof SafetyObservationRiskLevel]]?: any;
} = {
  High: 'A working act or a work condition that presents an immediate risk to life of the exposed person or results in the same exposure to others (employees, visitors or members of the public). Exposure may be acute such as a fall from height or chronic where exposure could result in long term health effects such as cancer causing.',
  Medium:
    'A working act or a work condition that presents a potential risk of injury (of any type except for risk to life) to exposed operatives or results in the exposure to others (employees, visitors or members of the public).',
  Low: 'A working act that while not in breach of a regulatory standard does not afford the best form of protection to the employee or a condition that requires improvement for the maintenance of a high-level of safety performance such as housekeeping observations.',
  'Good Practice':
    'A working act or a work condition that is fully in compliance with regulatory standards or project safety plans are recognized as good practice. Another example of good practice could be where an operative is going above and beyond for the purpose of health and safety.',
};

export enum SafetyObservationsBreachType {
  REGULATORY = 'Regulatory',
  PROJECT_PLAN = 'Project Plan',
}

export const SafetyObservationsBreachTypeDescriptions: {
  [key in typeof SafetyObservationsBreachType[keyof typeof SafetyObservationsBreachType]]?: any;
} = {
  Regulatory: `A regulatory breach refers to a violation of regulations or laws that are put in place to ensure the health and safety of individuals in a particular environment.`,
  'Project Plan': `A safety plan breach refers to a situation where there is a failure to comply with a safety plan that has been established to prevent accidents and injuries in the workplace or any other environment. A safety plan breach can occur when an individual or an organization fails to implement the safety measures that have been outlined in the safety plan, or when they deviate from the established safety procedures.`,
};

export enum SafetyObservationSubcategory {
  HEIGHT_WORKS = 'Height Works',
  EXCAVATIONS = 'Excavations',
  HOT_WORKS = 'Hot works',
  CONFINED_SPACES = 'Confined Spaces',
  LIFTING_OPERATIONS = 'Lifting Operations',
  MAINTENANCE = 'Maintenance',
  CLEANING = 'Cleaning',
  ELECTRICAL_WORKS_NON_POWERED_CIRCUITS = 'Electrical works (non-powered circuits)',
  ELECTRICAL_POWERED_CIRCUITS = 'Electrical (powered circuits)',
  STEEL_ERECTION = 'Steel Erection',
  CONCRETE_WORKS = 'Concrete Works',
  HAND_TOOLS = 'Hand Tools',
  POWER_TOOLS = 'Power Tool',
  MACHINERY = 'Machinery',
  ENERGY_ISOLATION_LOCK_OUT_TAG_OUT = 'Energy Isolation / Lock-Out & Tag-Out',
  HOUSEKEEPING = 'Housekeeping',
  UNEVEN_SURFACES = 'Uneven surfaces',
  MATERIAL_HANDLING_MANUAL_HANDLING = 'Material Handling / Manual Handling',
  VEHICLES = 'Vehicles',
  CHEMICAL_HANDLING_USE_LEAKS = 'Chemical Handling / Use / Leaks',
  HAZARDOUS_AREA_ATEX = 'Hazardous Area / ATEX',
  LIGHTING = 'Lighting',
  AIR_QUALITY = 'Air Quality',
  BULLYING = 'Bullying',
  HARRASSMENT = 'Harassment',
  NOISE = 'Noise',
  VIBRATION = 'Vibration',
  RESOURCES_AND_PLANNING = 'Resource and planning',
  FATIGUE = 'Fatigue',
  LONE_WORKING = 'Lone Working',
  DRUGS_AND_ALCOHOL_ABUSE = 'Drugs and Alcohol Abuse',
  AGRICULTURAL_WORKS = 'Agricultural works',
  MEDICAL_OPERATIONS = 'Medical Operations',
  RADIATION = 'Radiation',
  TEMPERATURE_EXTREMES = 'Temperature Extremes',
  PRESSURE = 'Pressure',
  CRUSHING = 'Crushing',
  ENTANGLEMENT = 'entanglement',
  ENTRAPMENT = 'entrapment',
  ASPHYXIATION = 'asphyxiation',
  ENGULFMENT = 'Engulfment',
  LACERATION = 'Laceration',
}

export enum SafetyObservationUnsafeActOrCondition {
  UNSAFE_ACT = 'Act',
  CONDITION = 'Condition',
}

export const SafetyObservationUnsafeActOrConditionDescriptions: {
  [key in typeof SafetyObservationUnsafeActOrCondition[keyof typeof SafetyObservationUnsafeActOrCondition]]?: any;
} = {
  Act: 'An unsafe act is when an individual who has both knowledge and control of an existing unsafe condition or action, but choses to perform the action or ignore the condition.',
  Condition:
    'A condition in the work place that is likely to cause property damage or injury. (Housekeeping issues shall be classified as unsafe conditions)',
};

export enum SafetyObservationCategory {
  PHYSICAL_RISK = 'Physical Risk',
  BIOLOGICAL_RISK = 'Biological Risk',
  CHEMICAL_RISK = 'Chemical Risk',
  PHYSIOLOGICAL_RISK = 'Physiological Risk',
}

export const SafetyObservationCategoryDescriptions: {
  [key in typeof SafetyObservationCategory[keyof typeof SafetyObservationCategory]]?: any;
} = {
  'Biological Risk':
    'Biological risks are microorganisms that are biological in nature and origin, to which exposure in sufficient quantities and duration may result in illness or injury to human health. Biological agents include bacteria, viruses, fungi and parasites or parts thereof or products they generate.',
  'Physical Risk':
    'Physical risks includes noise, ionizing or non-ionizing radiation, extremes in temperature and pressure, vibration, electric and magnetic fields, ergonomic injuries, electric shock, electrocution, crushing, entanglment, entrapement,engulfment, lacerations or any other potential physical injury.',
  'Chemical Risk':
    'Chemical risk describes all chemical elements and compounds in a natural state or in a processed state and their byproducts, the exposure to which in sufficient quantities and duration may result in illness or injury to human health.',
  'Physiological Risk':
    'Psychological risk is the possibility for psychological injury to occur when exposed to a hazard. Hazards from a psychological perspective are situations or factors that could increase the likelihood of employees experiencing a stress response - essentially a physical, mental or emotional reaction - Examples include: Poor workplace conditions (Poor lighting, poor air quality, excessive noise levels) Job demands (Unrealistic timeframes, insufficient resources), bullying and or harrassment, Poor work schedules resulting in fatigue, lone working, drug and/or alcohol abuse.',
};

@Entity('safety-observations')
export class SafetyObservations extends ApptBaseEntity {
  @Column('timestamp', { nullable: true })
  dateObserved: Date;

  @Column('text', { nullable: true })
  observation: string;

  @Column({ type: 'enum', enum: SafetyObservationCategory, nullable: true })
  category: SafetyObservationCategory;

  @OneToMany(() => Record, (rec) => rec.photoEvidenceSo, { eager: true })
  photoEvidence: Record[];

  @OneToMany(() => Record, (rec) => rec.photoEvidenceClosureSo, { eager: true })
  photoEvidenceClosure: Record[];

  @Column({ type: 'enum', enum: SafetyObservationRiskLevel, nullable: true })
  riskLevel: SafetyObservationRiskLevel;

  @Column({ type: 'enum', enum: SafetyObservationSubcategory, nullable: true })
  subcategory: SafetyObservationSubcategory;

  @Column({ type: 'enum', enum: SafetyObservationsBreachType, nullable: true })
  breachType: SafetyObservationsBreachType;

  @Column('text', { nullable: true })
  actionTaken: string;

  @Column('text', { nullable: true })
  requiredAction: string;

  @Column({
    type: 'enum',
    enum: SafetyObservationUnsafeActOrCondition,
    nullable: true,
  })
  unsafeActOrCondition: SafetyObservationUnsafeActOrCondition;

  @ManyToOne(() => OrganisationContractor, (oc) => oc.safetyReports, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'contractorId' })
  contractor: OrganisationContractor | null;
  @Column({ nullable: true })
  contractorId: string | null;

  @Column('boolean', { nullable: true })
  signature: boolean;
  @Column('boolean', { nullable: true })
  closingSignature: boolean;
}

export class SafetyObservationsDTO extends ApptBaseDTO {
  @IsDateString()
  @IsOptional()
  dateObserved?: Date;

  @IsUUID()
  @IsOptional()
  contractorId: string;

  @IsString()
  @IsOptional()
  observation?: string;

  @IsEnum(SafetyObservationRiskLevel)
  @IsOptional()
  riskLevel?: SafetyObservationRiskLevel;

  @IsEnum(SafetyObservationSubcategory)
  @IsOptional()
  subcategory?: SafetyObservationSubcategory;

  @IsEnum(SafetyObservationCategory)
  @IsOptional()
  category?: SafetyObservationCategory;

  @IsEnum(SafetyObservationsBreachType)
  @IsOptional()
  breachType?: SafetyObservationsBreachType;

  @IsString()
  @IsOptional()
  actionTaken: string;

  @IsString()
  @IsOptional()
  requiredAction?: string;

  @IsEnum(SafetyObservationUnsafeActOrCondition)
  @IsOptional()
  unsafeActOrCondition?: SafetyObservationUnsafeActOrCondition;

  @IsBoolean()
  @IsOptional()
  signature?: boolean;

  @IsBoolean()
  @IsOptional()
  closingSignature?: boolean;
}
