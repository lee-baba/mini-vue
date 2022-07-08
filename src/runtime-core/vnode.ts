import { ShapeFLags } from "../shared/ShapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createVnode(type: any, props?: any, children?: any) {
  const vnode: any = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlay(type),
  };

  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFLags.TEXT_CHILDREN;
  }

  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFLags.ARRAY_CHILDREN;
  }

  if (vnode.shapeFlag & ShapeFLags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFLags.SLOT_CHILDREN;
    }
  }

  return vnode;
}

export function createTextVnode(text: string) {
  return createVnode(Text, {}, text);
}

function getShapeFlay(type: any) {
  return typeof type === "string"
    ? ShapeFLags.ELEMENT
    : ShapeFLags.STATEFUL_COMPONENT;
}
