import * as moment from 'moment';

export const dateToLocalStringsTraverse = (data: any) => {
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      data[key] = moment.utc(value).local().format(`YYYY-MM-DDTHH:mm:ss`);
    } else if (typeof value === 'object' && value !== null) {
      dateToLocalStringsTraverse(data[key]);
    }
  }
};
