import { mutableHandlers, reactiveFlag, readonlyHandlers } from "./baseHandler";

export const isReactive = (value: any): Boolean => {
  return !!value[reactiveFlag.ISREACTIVE];
};

export const isReadonly = (value: any): Boolean => {
  return !!value[reactiveFlag.ISREADONLU];
};

export const reactive = (raw = {}) => {
  return createProxyObject(raw, mutableHandlers);
};

export const readonly = (raw = {}) => {
  return createProxyObject(raw, readonlyHandlers);
};

const createProxyObject = (raw: any, baseHandlers: any) => {
  return new Proxy(raw, baseHandlers);
};
