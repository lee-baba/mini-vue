function createComponentInstance(vnode) {
    const Component = {
        vnode,
        type: vnode,
    };
    return Component;
}
function setupComponent(instance) {
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree);
}

function createVnode(type, props, children) {
    const component = {
        type,
        props,
        children,
    };
    return component;
}

const createApp = (rootComponent) => {
    return {
        mount: (rootContainer) => {
            document.querySelector(rootContainer);
            const vnode = createVnode(rootComponent);
            render(vnode);
        },
    };
};

function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };
