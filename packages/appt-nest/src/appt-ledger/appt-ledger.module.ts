import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { ApptLedgerController } from './appt-ledger.controller';
import { ApptLedger } from './appt-ledger.entity';
import { ApptLedgerService } from './appt-ledger.service';

@Module({
  controllers: [ApptLedgerController],
  providers: [ApptLedgerService],
  exports: [ApptLedgerService],
  imports: [TypeOrmModule.forFeature([ApptLedger]), PermissionsModule],
})
export class ApptLedgerModule {}
