'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const publicInstanceProxyMap = {
    $el: (i) => i.vnode.el,
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicInstanceProxyMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    const Component = {
        vnode,
        type: vnode.type,
        setupState: {},
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
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag } = vnode;
    if (shapeFlag & 2 /* ShapeFLags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
    if (shapeFlag & 1 /* ShapeFLags.ELEMENT */) {
        processElement(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children, shapeFlag } = vnode;
    const element = document.createElement(type);
    vnode.el = element;
    if (shapeFlag & 4 /* ShapeFLags.TEXT_CHILDREN */) {
        element.textContent = children;
    }
    if (shapeFlag & 8 /* ShapeFLags.ARRAY_CHILDREN */) {
        mountElementChildren(children, element);
    }
    for (let key in props) {
        const hasOn = (key) => /^on[A-Z]/.test(key);
        let val = props[key];
        if (hasOn(key)) {
            const event = key.slice(2).toLowerCase();
            element.addEventListener(event, val);
        }
        else {
            element.setAttribute(key, val);
        }
    }
    container.append(element);
}
function mountElementChildren(vnodes, container) {
    vnodes.forEach((vnode) => {
        patch(vnode, container);
    });
}
function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const subTree = instance.render.call(instance.proxy);
    initialVnode.el = subTree;
    patch(subTree, container);
}

function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlay(type),
    };
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* ShapeFLags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFLags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlay(type) {
    return typeof type === "string"
        ? 1 /* ShapeFLags.ELEMENT */
        : 2 /* ShapeFLags.STATEFUL_COMPONENT */;
}

const createApp = (rootComponent) => {
    return {
        mount: (rootContainer) => {
            const root = document.querySelector(rootContainer);
            const vnode = createVnode(rootComponent);
            render(vnode, root);
        },
    };
};

function h(type, props, children) {
    return createVnode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
