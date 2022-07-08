import { initProps } from "./componentProps";
import { initEmit } from "./componentEmit";
import { shallowReadonly } from "./../reactivity/reactive";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlot";

export function createComponentInstance(vnode: any) {
  const Component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
  };

  Component.emit = initEmit.bind(null, Component) as any;
  return Component;
}

export function setupComponent(instance: any) {
  initProps(instance, shallowReadonly(instance.vnode.props));
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const { setup } = instance.type;
  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(instance.props, { emit: instance.emit });
    setCurrentInstance(null);
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

let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}
