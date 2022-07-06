import { publicInstanceProxyHandlers } from "./componentPublicInstance";
export function createComponentInstance(vnode: any) {
  const Component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };
  return Component;
}

export function setupComponent(instance: any) {
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const { setup } = instance.type;
  if (setup) {
    const setupResult = setup();
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
