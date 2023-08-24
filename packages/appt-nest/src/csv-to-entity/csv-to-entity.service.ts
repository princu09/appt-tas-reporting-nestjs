import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as csv from 'csvtojson';
import { ApptBaseEntity } from 'src/base/appt-base-entity';

type CsvToEntityError = {
  row: number;
  errors: ValidationError[];
};

type CsvToEntityReturn<T> = {
  objects: T[];
  errors: CsvToEntityError[];
};

@Injectable()
export class CsvToEntityService {
  async convert<T, DTO>(
    buffer: string,
    dto: new () => DTO,
    base: Partial<ApptBaseEntity>,
    converter: (T: T) => T = null,
  ): Promise<CsvToEntityReturn<T>> {
    const json = await csv({}).fromString(buffer);
    const ret: CsvToEntityReturn<T> = {
      objects: [],
      errors: [],
    };

    // Add the base entity so
    for (let i = 0; i < json.length; ++i) {
      let obj = {
        ...json[i],
        ...base,
      };

      if (converter) {
        obj = converter(obj);
      }

      // Convert to class dtp
      obj = plainToInstance(dto, obj);

      // convert string ints to ints
      Object.keys(obj).forEach(function (key) {
        if (obj[key]) {
          // If empty string set to null
          if (obj[key][0] != '0' && !isNaN(+obj[key])) {
            // make sure we dont turn phone numbers into strings
            obj[key] = +obj[key];
          }

          try {
            obj[key] = JSON.parse(obj[key]); // If its valid json parse it
          } catch (err) {
            // do nothing
          }
        } else {
          obj[key] = null;
        }
      });

      // Check for validation errors
      const errors = await validate(obj);

      // Report errors
      if (errors.length) {
        ret.errors.push({
          row: i,
          errors: errors,
        });
      } else {
        // return the object
        ret.objects.push(obj);
      }
    }

    return ret;
  }
}
