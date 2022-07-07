export const initEmit = (instance: any, event: string, ...arg: Array<any>) => {
  const { props } = instance;

  const handleKeyName = toHandleName(capitalize(event));
  props[handleKeyName] && props[handleKeyName](...arg);
};

const capitalize = (name: string): string => {
  return (name && name[0].toUpperCase() + name.slice(1)) || "";
};

const toHandleName = (eventName: string): string => {
  return (eventName && `on${capitalize(eventName)}`) || "";
};
