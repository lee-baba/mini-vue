import { collectionEffect, triggerEffect } from "./effect";
export const reactive = (raw) => {
  return new Proxy(raw, {
    get(target, key) {
      const result = Reflect.get(target, key);

      // TODO 收集依赖
      collectionEffect(target, key);
      return result;
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value);
      // TODO 触发所有的依赖
      triggerEffect(target, key);
      return result;
    },
  });
};
