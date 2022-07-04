export const extend = Object.assign;

export const isObject = (value: any) => {
  return value !== null && typeof value === "object";
};

export const hasChange = <T>(newVal: T, oldVal: T) => {
  return !Object.is(newVal, oldVal);
};
