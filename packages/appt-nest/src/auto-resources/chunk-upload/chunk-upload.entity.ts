import { Record } from '../record/record.entity';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';

export class chunkPart {
  ETag: string;
  PartNumber: number;
}

@Entity('chunkupload')
export class ChunkUpload extends ApptBaseEntity {
  @Column()
  uploadId: string;

  @Column()
  fileName: string;

  @Column()
  key: string;

  @Column()
  fileType: string;

  @Column()
  bucket: string;

  @Column('jsonb', { nullable: true, default: [] })
  partsUploaded: chunkPart[] = [];

  @ManyToOne(() => Record, { eager: true, onDelete: 'CASCADE' })
  @JoinTable()
  finishedRecord: Record;
}
