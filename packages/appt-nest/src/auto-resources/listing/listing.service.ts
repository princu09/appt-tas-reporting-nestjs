import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Response } from 'express';
import { CsvToEntityService } from 'src/csv-to-entity/csv-to-entity.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { Listing, ListingDTO } from './listing.entity';

@Injectable()
export class ListingService extends TypeOrmCrudService<Listing> {
  constructor(
    @InjectRepository(Listing) repo,
    public convert: CsvToEntityService,
    public localService: LocalsService,
  ) {
    super(repo);
  }

  async uploadFile(res: Response, file: Express.Multer.File) {
    const csv = await this.convert.convert(file.buffer.toString(), ListingDTO, {
      organisation: this.localService.getOrganisation(res).id,
      owner: this.localService.getUserId(res),
      site: this.localService.getSite(res)?.id,
    });
    csv.objects = await this.repo.save(csv.objects);
    return csv;
  }
}
