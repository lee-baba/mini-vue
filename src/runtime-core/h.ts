import { createVnode } from "./vnode";

export function h(type: any, props?: any, children?: any) {
  return createVnode(type, props, children);
}
