import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../base/appt-base-entity';

@Entity('metadata')
export class Metadata extends ApptBaseEntity {
  @Column('int', { name: 'objId', nullable: true, default: null })
  objId: number | null;

  @Column('varchar', {
    name: 'key',
    nullable: true,
    default: null,
    length: 1024,
  })
  key: string | null;

  @Column('varchar', {
    name: 'value',
    nullable: true,
    default: null,
    length: 1024,
  })
  value: string | null;

  @Column('varchar', {
    name: 'type',
    nullable: true,
    default: null,
    length: 1024,
  })
  type: string | null;
}
