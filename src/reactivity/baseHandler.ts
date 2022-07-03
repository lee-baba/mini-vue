import { collectionEffect, triggerEffect } from "./effect";

const createGetter = (isReadonly = false) => {
  return (target: any, key: any) => {
    const result = Reflect.get(target, key);
    if (!isReadonly) {
      collectionEffect(target, key);
    }
    return result;
  };
};

const createSetter = (isReadonly = false) => {
  return (target: any, key: any, value: any) => {
    if (isReadonly) {
      console.warn(
        `${key.toString()} set fail,because the ${target} is readonly`
      );
      return true;
    }

    const result = Reflect.set(target, key, value);

    triggerEffect(target, key);
    return result;
  };
};

const get = createGetter();
const set = createSetter();

const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
};
