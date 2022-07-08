import { extend, isObject } from "../shared/index";
import { collectionEffect, triggerEffect } from "./effect";
import { reactive, readonly } from "./reactive";

export const enum reactiveFlag {
  ISREACTIVE = "_IS_REACTIVE",
  ISREADONLU = "_IS_READONLY",
}

const createGetter = (isReadonly = false, isShallow = false) => {
  return (target: any, key: any) => {
    if (key === reactiveFlag.ISREACTIVE) return !isReadonly;

    if (key === reactiveFlag.ISREADONLU) return !!isReadonly;

    const result = Reflect.get(target, key);

    if (isShallow) return result;

    if (!isReadonly) {
      collectionEffect(target, key);
    }

    if (isObject(result)) {
      return (isReadonly && readonly(result)) || reactive(result);
    }

    return result;
  };
};

const createSetter = (isReadonly = false) => {
  return (target: any, key: any, value: any) => {
    if (isReadonly) {
      console.warn(`${key.toString()} set fail,because the ${key} is readonly`);
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

const shallowReadonlyGet = createGetter(true, true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
