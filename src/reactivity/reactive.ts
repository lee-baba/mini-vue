import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export const reactive = (raw = {}) => {
  return createProxyObject(raw, mutableHandlers);
};

export const readonly = (raw = {}) => {
  return createProxyObject(raw, readonlyHandlers);
};

const createProxyObject = (raw: any, baseHandlers: any) => {
  return new Proxy(raw, baseHandlers);
};
