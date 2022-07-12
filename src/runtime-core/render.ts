import { computed } from "./../reactivity/computed";
import { Fragment } from "./vnode";
import { ShapeFLags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";

export function createRenderer(options: any) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProps,
    insert: hostInsert,
  } = options;

  function render(vnode: any, container: any) {
    patch(vnode, container, null);
  }

  function patch(vnode: any, container: any, parentComponent: any) {
    const { shapeFlag, type } = vnode;

    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;

      case Text:
        processText(vnode, container);
        break;

      default:
        if (shapeFlag & ShapeFLags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        }

        if (shapeFlag & ShapeFLags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }

        break;
    }
  }

  function processFragment(vnode: any, container: any, parentComponent: any) {
    mountElementChildren(vnode, container, parentComponent);
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = document.createTextNode(children);
    container.append(textNode);
  }

  function processElement(vnode: any, container: any, parentComponent: any) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent: any) {
    const { type, props, children, shapeFlag } = vnode;

    const element = hostCreateElement(type);

    vnode.el = element;

    if (shapeFlag & ShapeFLags.TEXT_CHILDREN) {
      element.textContent = children;
    }

    if (shapeFlag & ShapeFLags.ARRAY_CHILDREN) {
      mountElementChildren(children, element, parentComponent);
    }

    for (let key in props) {
      const val = props[key];

      hostPatchProps(element, key, val);
    }

    hostInsert(element, container);
  }

  function mountElementChildren(
    vnodes: any,
    container: any,
    parentComponent: any
  ) {
    vnodes.forEach((vnode: any) => {
      patch(vnode, container, parentComponent);
    });
  }

  function processComponent(vnode: any, container: any, parentComponent: any) {
    mountComponent(vnode, container, parentComponent);
  }

  function mountComponent(
    initialVnode: any,
    container: any,
    parentComponent: any
  ) {
    const instance = createComponentInstance(initialVnode, parentComponent);

    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }

  function setupRenderEffect(instance: any, initialVnode: any, container: any) {
    const subTree = instance.render.call(instance.proxy);

    patch(subTree, container, instance);

    initialVnode.el = subTree;
  }

  return {
    createApi: createAppAPI(render),
  };
}
