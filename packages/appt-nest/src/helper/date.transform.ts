import * as moment from 'moment';

export const stringToDate = ({ value }) => {
  return value && moment(value).isValid() ? moment(value).toDate() : undefined;
};
