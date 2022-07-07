import { initEmit } from "./componentEmit";
import { shallowReadonly } from "./../reactivity/reactive";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
export function createComponentInstance(vnode: any) {
  const Component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: shallowReadonly(vnode.props) || {},
    emit: () => {},
  };

  Component.emit = initEmit.bind(null, Component) as any;
  return Component;
}

export function setupComponent(instance: any) {
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const { setup } = instance.type;
  if (setup) {
    const setupResult = setup(instance.props, { emit: instance.emit });
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  instance.render = Component.render;
}
