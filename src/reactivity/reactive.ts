import {
  mutableHandlers,
  reactiveFlag,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandler";

export const isReactive = (value: any): Boolean => {
  return !!value[reactiveFlag.ISREACTIVE];
};

export const isReadonly = (value: any): Boolean => {
  return !!value[reactiveFlag.ISREADONLU];
};

export const isProxy = (value: any): Boolean => {
  return isReactive(value) || isReadonly(value);
};

export const reactive = (raw = {}) => {
  return createProxyObject(raw, mutableHandlers);
};

export const readonly = (raw = {}) => {
  return createProxyObject(raw, readonlyHandlers);
};

export const shallowReadonly = (raw = {}) => {
  return createProxyObject(raw, shallowReadonlyHandlers);
};

const createProxyObject = (raw: any, baseHandlers: any) => {
  return new Proxy(raw, baseHandlers);
};
