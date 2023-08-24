import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { AwsService } from 'src/services/aws/aws.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { Repository } from 'typeorm';
import { Record } from './record.entity';

export type UploadErrors = {
  name: string;
  message: string;
};

export type RecordCreateStats = {
  records: Record[];
  errors: UploadErrors[];
};

@Injectable()
export class RecordService extends TypeOrmCrudService<Record> {
  constructor(
    @InjectRepository(Record) public repo: Repository<Record>,
    private aws: AwsService,
    private locals: LocalsService,
  ) {
    super(repo);
  }

  async signURL(record: Record): Promise<Record> {
    record.fileUrl = await this.aws.getSignedURL(record.fileUrl);
    return record;
  }

  async uploadFiles(
    res: Response,
    files: Array<Express.Multer.File>,
  ): Promise<RecordCreateStats> {
    const ret = {
      records: [],
      errors: [],
    };

    for (const file of files) {
      try {
        const upload = await this.aws.uploadS3(file.buffer, file?.originalname);
        const newRecord = await this.repo.save({
          fileName: file?.originalname,
          fileUrl: upload.Location,
          fileType: file?.mimetype,
          owner: this.locals.getUserId(res),
          organisation: this.locals.getOrganisation(res)?.id,
          site: this.locals.getSite(res)?.id,
        });
        newRecord.fileUrl = await this.aws.getSignedURL(newRecord.fileUrl);
        ret.records.push(newRecord);
      } catch (err) {
        ret.errors.push({
          name: file?.originalname,
          message: `${err}`,
        });
      }
    }
    return ret;
  }
}
