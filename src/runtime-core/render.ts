import { Fragment } from "./vnode";
import { ShapeFLags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  const { shapeFlag, type } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode.children, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFLags.ELEMENT) {
        processElement(vnode, container);
      }

      if (shapeFlag & ShapeFLags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
      break;
  }
}

function processFragment(vnode: any, container: any) {
  mountElementChildren(vnode, container);
}

function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
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

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
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

  patch(subTree, container);

  initialVnode.el = subTree;
}
