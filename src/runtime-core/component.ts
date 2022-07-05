export function createComponentInstance(vnode: any) {
  const Component = {
    vnode,
    type: vnode,
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
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  instance.render = Component.render;
}
