import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvToEntityService } from 'src/csv-to-entity/csv-to-entity.service';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { ListingController } from './listing.controller';
import { Listing } from './listing.entity';
import { ListingService } from './listing.service';

@Module({
  controllers: [ListingController],
  providers: [ListingService, CsvToEntityService],
  imports: [TypeOrmModule.forFeature([Listing]), PermissionsModule],
})
export class ListingModule {}
