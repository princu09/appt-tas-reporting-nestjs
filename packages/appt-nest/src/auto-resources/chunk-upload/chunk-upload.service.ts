import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import type { Response } from 'express';
import { RecordService } from 'src/auto-resources/record/record.service';
import { AwsService } from 'src/services/aws/aws.service';
import { LocalsService } from 'src/services/locals/locals.service';
import type { Repository } from 'typeorm';
import { ChunkUpload } from './chunk-upload.entity';

@Injectable()
export class ChunkUploadService extends TypeOrmCrudService<ChunkUpload> {
  constructor(
    @InjectRepository(ChunkUpload) public repo: Repository<ChunkUpload>,
    public locals: LocalsService,
    public aws: AwsService,
    public recordService: RecordService,
  ) {
    super(repo);
  }

  async signUrl(data: ChunkUpload) {
    if (data?.finishedRecord?.fileUrl) {
      data.finishedRecord = await this.recordService.signURL(
        data.finishedRecord,
      );
    }
  }

  async finish(id: string) {
    let chunkObj = await this.repo.findOneOrFail(id);

    // Make sure we have some uploads
    if (!chunkObj.partsUploaded.length) {
      throw new BadRequestException('This upload has not chunks');
    }

    // Check the parts ordered are in the correct order (1,2,3,4,5,6,7)
    chunkObj.partsUploaded = chunkObj.partsUploaded.sort((a, b) => {
      return a.PartNumber - b.PartNumber;
    });
    for (let i = 0; i < chunkObj.partsUploaded.length; ++i) {
      if (chunkObj.partsUploaded[i].PartNumber != i + 1) {
        throw new BadRequestException(
          `Invalid chunk parts: ${chunkObj.partsUploaded}`,
        );
      }
    }

    const data = await this.aws.finishMultipartUpload(
      chunkObj.bucket,
      chunkObj.key,
      chunkObj.uploadId,
      chunkObj.partsUploaded,
    );

    // Attach the newly created record to the chunk upload
    const record = await this.recordService.repo.save({
      fileName: chunkObj.fileName,
      fileUrl: data.Location,
      fileType: chunkObj.fileType,
      organisation: chunkObj.organisation,
      site: chunkObj.site,
      owner: chunkObj.owner,
    });
    chunkObj.finishedRecord = record;
    chunkObj = await this.repo.save(chunkObj);
    chunkObj.finishedRecord = await this.recordService.signURL(record);
    return chunkObj;
  }

  async chunkUpload(id: string, partNumber: number, file: Express.Multer.File) {
    const chunkObj = await this.repo.findOneOrFail(id);
    const chunkData = await this.aws.uploadChunk(
      chunkObj.bucket,
      file.buffer,
      chunkObj.key,
      partNumber,
      chunkObj.uploadId,
    );
    chunkObj.partsUploaded.push({
      ETag: chunkData.ETag,
      PartNumber: partNumber,
    });
    await this.repo.save(chunkObj);
  }

  async start(fileName: string, res: Response) {
    const upload = await this.aws.startMultipartUpload(fileName);

    return await this.repo.save({
      bucket: upload.Bucket,
      key: upload.Key,
      fileName: fileName,
      fileType: fileName.split('.').pop(),
      uploadId: upload.UploadId,
      ...this.locals.getApptBaseEntity(res),
    });
  }
}
