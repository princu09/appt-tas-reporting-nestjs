import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApptLedgerModule } from 'src/appt-ledger/appt-ledger.module';
import { User } from 'src/auto-resources/user/user.entity';
import { UserModule } from 'src/auto-resources/user/user.module';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  controllers: [StripeController],
  imports: [
    ApptLedgerModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
