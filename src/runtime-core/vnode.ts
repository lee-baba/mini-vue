import { ShapeFLags } from "../shared/ShapeFlags";

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
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFLags.ARRAY_CHILDREN;
  }
  return vnode;
}

function getShapeFlay(type: any) {
  return typeof type === "string"
    ? ShapeFLags.ELEMENT
    : ShapeFLags.STATEFUL_COMPONENT;
}
