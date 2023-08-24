import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../auto-resources/user/user.entity';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { ContractorDataReport } from '../contractor-data-report/contractor-data-report.entity';
import { IncidentFlashReport } from '../incident-flash-report/incident-flash-report.entity';
import { SafetyObservations } from '../safety-observations/safety-observations.entity';

@Entity('organisationcontractor')
export class OrganisationContractor extends ApptBaseEntity {
  @Column('text')
  name: string;

  @Column('boolean', { default: false })
  default: boolean;

  @ManyToMany(() => User, (user) => user.contractors)
  @JoinTable()
  users: User[];

  @OneToMany(() => IncidentFlashReport, (flashReport) => flashReport.contractor)
  flashReports: IncidentFlashReport[];

  @OneToMany(() => ContractorDataReport, (cdr) => cdr.contractor)
  contractorDataReports: ContractorDataReport[];

  @OneToMany(() => SafetyObservations, (so) => so.contractor)
  safetyReports: SafetyObservations[];
}

export class OrganisationContractorAssignDTO {
  @IsUUID()
  userId: string;
}

export class OrganisationContractorDTO extends ApptBaseDTO {
  @IsString()
  name: string;
}
