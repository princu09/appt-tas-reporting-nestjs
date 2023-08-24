import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import * as md5 from 'md5';
import * as path from 'path';
import * as S from 'string';
import { v4 } from 'uuid';
import * as sanitiseFileName from 's3-filename';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  constructor(private httpService: HttpService) {}

  public getSignedURL(baseUrl: string): Promise<string> {
    return this.getSignedUrlPromise(this.getS3(), baseUrl);
  }

  private async getSignedUrlPromise(s3: S3, baseUrl: string) {
    const key = S(baseUrl).between('com/').s;
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Expires: 1800,
    };
    return await s3.getSignedUrlPromise('getObject', params);
  }

  async uploadS3(
    file: Buffer,
    fileName: string,
  ): Promise<S3.ManagedUpload.SendData> {
    const s3 = this.getS3();
    const fileNameSan = sanitiseFileName(fileName);
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: String(v4() + fileNameSan),
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
        if (err) {
          this.logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async getFileBuffer(url: string): Promise<Buffer> {
    const s3 = this.getS3();
    const signedUrl = await this.getSignedUrlPromise(s3, url);

    const signedUrlParts = new URL(signedUrl);

    const key = md5(signedUrlParts.pathname);
    const extension = path.extname(signedUrlParts.pathname);

    const cacheKey = `s3-${key}${extension}`;
    const filePath = path.join(process.env.TMP_FILE_PATH, cacheKey);

    const existsLocally = fs.existsSync(filePath);
    if (existsLocally) {
      return fs.readFileSync(filePath);
    }

    // Download file then read and return a buffer
    const writer = fs.createWriteStream(filePath);
    const response = await this.httpService.axiosRef({
      url: signedUrl,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve(fs.readFileSync(filePath));
      });
      writer.on('error', reject);
    });
  }

  async finishMultipartUpload(
    bucket: string,
    key: string,
    uploadId: string,
    parts: S3.CompletedPart[],
  ) {
    try {
      return await this.getS3()
        .completeMultipartUpload({
          Key: key,
          Bucket: bucket,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: parts,
          },
        })
        .promise();
    } catch (err) {
      this.logger.error(
        `Failed to finishMultipartUpload: bucket: ${bucket}, key: ${key}, uploadId: ${uploadId}, err: ${err}`,
      );
      throw new InternalServerErrorException(err);
    }
  }

  async uploadChunk(
    bucket: string,
    buffer: Buffer,
    key: string,
    partNumber: number,
    uploadId: string,
  ) {
    try {
      return await this.getS3()
        .uploadPart({
          Bucket: bucket,
          Body: buffer,
          Key: key,
          PartNumber: partNumber,
          UploadId: uploadId,
        })
        .promise();
    } catch (err) {
      this.logger.error(
        `Failed to uploadChunk: bucket: ${bucket}, key: ${key}, partNumber: ${partNumber}, uploadId: ${uploadId}, err: ${err}`,
      );
      throw new InternalServerErrorException(err);
    }
  }

  async startMultipartUpload(fileName: string) {
    const key = `${v4()}-${fileName.split(' ').join('-')}`;
    try {
      return await this.getS3()
        .createMultipartUpload({
          Key: key,
          Bucket: process.env.AWS_BUCKET,
        })
        .promise();
    } catch (err) {
      this.logger.error(
        `Failed to startMultipartUpload: fileName: ${fileName}: key ${key}: err ${err}`,
      );
      throw new InternalServerErrorException(err);
    }
  }
  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      region: process.env.AWS_REGION,
      signatureVersion: 'v4',
      params: { Bucket: process.env.AWS_BUCKET },
    });
  }
}
