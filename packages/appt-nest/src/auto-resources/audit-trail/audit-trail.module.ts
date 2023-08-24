import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { AudittrailController } from './audit-trail.controller';
import { AudittrailService } from './audit-trail.service';
import { Audittrail } from './audit-trail.entity';

@Module({
  controllers: [AudittrailController],
  providers: [AudittrailService],
  imports: [TypeOrmModule.forFeature([Audittrail]), PermissionsModule],
})
export class AudittrailModule {}
