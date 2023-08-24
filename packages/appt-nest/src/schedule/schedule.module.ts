import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [ScheduleWrapper],
  imports: [ScheduleWrapper],
})
export class ScheduleWrapper {
  public static forRoot() {
    if (process.env.pm_id === '1' || process.env.pm_id === undefined)
      return ScheduleModule.forRoot();

    return {
      module: ScheduleWrapper,
      providers: [],
    };
  }
}
