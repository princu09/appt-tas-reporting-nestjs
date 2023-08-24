import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { MediaRestrictionController } from './media-restriction.controller';
import { MediaRestriction } from './media-restriction.entity';
import { MediaRestrictionService } from './media-restriction.service';

@Module({
  controllers: [MediaRestrictionController],
  providers: [MediaRestrictionService],
  imports: [TypeOrmModule.forFeature([MediaRestriction]), PermissionsModule],
})
export class MediaRestrictionModule {}
