export const stringToBoolean = ({ value }) => {
  if (value === undefined) return undefined;
  return [true, 1, '1', 'enabled', 'true'].indexOf(value) > -1;
};
