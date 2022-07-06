import { ShapeFLags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  const { shapeFlag } = vnode;

  if (shapeFlag & ShapeFLags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }

  if (shapeFlag & ShapeFLags.ELEMENT) {
    processElement(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children, shapeFlag } = vnode;

  const element = document.createElement(type);
  vnode.el = element;

  if (shapeFlag & ShapeFLags.TEXT_CHILDREN) {
    element.textContent = children;
  }

  if (shapeFlag & ShapeFLags.ARRAY_CHILDREN) {
    mountElementChildren(children, element);
  }

  for (let key in props) {
    const hasOn = (key: string) => /^on[A-Z]/.test(key);
    let val = props[key];
    if (hasOn(key)) {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, val);
    } else {
      element.setAttribute(key, val);
    }
  }
  container.append(element);
}

function mountElementChildren(vnodes: any, container: any) {
  vnodes.forEach((vnode: any) => {
    patch(vnode, container);
  });
}

function mountComponent(initialVnode: any, container: any) {
  const instance = createComponentInstance(initialVnode);

  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance: any, initialVnode: any, container: any) {
  const subTree = instance.render.call(instance.proxy);

  initialVnode.el = subTree;

  patch(subTree, container);
}
