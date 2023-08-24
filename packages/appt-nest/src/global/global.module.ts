import { Global, Module } from '@nestjs/common';
import { LocalsService } from '../services/locals/locals.service';

@Global()
@Module({
  providers: [LocalsService],
  exports: [LocalsService],
})
export class GlobalModule {}
