import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../base/appt-base-entity';

@Entity('statapirequest')
export class Statapirequest extends ApptBaseEntity {
  @Column('varchar', {
    name: 'endpoint',
    nullable: true,
    default: null,
    length: 255,
  })
  endpoint: string | null;

  @Column('int', { name: 'responseStatus', nullable: true, default: null })
  responseStatus: number | null;

  @Column('varchar', {
    name: 'method',
    nullable: true,
    default: null,
    length: 255,
  })
  method: string | null;

  @Column('varchar', {
    name: 'currentOrganisation',
    nullable: true,
    default: null,
    length: 255,
  })
  currentOrganisation: string | null;

  @Column('varchar', {
    name: 'appVersionNumber',
    nullable: true,
    default: null,
    length: 255,
  })
  appVersionNumber: string | null;

  @Column('varchar', {
    name: 'appBuildNumber',
    nullable: true,
    default: null,
    length: 255,
  })
  appBuildNumber: string | null;

  @Column('varchar', {
    name: 'appBundleId',
    nullable: true,
    default: null,
    length: 255,
  })
  appBundleId: string | null;

  @Column('varchar', { name: 'os', nullable: true, default: null, length: 255 })
  os: string | null;

  @Column('varchar', {
    name: 'osVersion',
    nullable: true,
    default: null,
    length: 255,
  })
  osVersion: string | null;

  @Column('varchar', {
    name: 'deviceModel',
    nullable: true,
    default: null,
    length: 255,
  })
  deviceModel: string | null;
}
