import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RecordService } from 'src/auto-resources/record/record.service';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class RecordInterceptor implements NestInterceptor {
  constructor(
    public reflector: Reflector,
    public record: RecordService,
    public locals: LocalsService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map(async (data) => {
        // Get route specific
        let routeRecordAttributes = this.reflector.get<string[]>(
          'records',
          context.getHandler(),
        );
        let classRecordAttributes = this.reflector.get<string[]>(
          'records',
          context.getClass(),
        );

        if (!routeRecordAttributes) routeRecordAttributes = [];
        if (!classRecordAttributes) classRecordAttributes = [];

        const recordAttributes = routeRecordAttributes.concat(
          classRecordAttributes,
        );

        if (!recordAttributes?.length) return;

        const recursiveSign = async (data, recordAttributes) => {
          if (Array.isArray(data)) {
            for (const d of data) {
              await recursiveSign(d, recordAttributes);
            }
          } else {
            for (const attrib of recordAttributes) {
              try {
                if (data[attrib]) {
                  data[attrib] = await this.record.signURL(data[attrib]);
                }
              } catch (err) {}
            }
          }
        };

        try {
          await recursiveSign(data, recordAttributes);
        } catch (err) {}

        return data;
      }),
    );
  }
}
