const Fragment = Symbol("Fragment");
const Text$1 = Symbol("Text");
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
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFLags.ARRAY_CHILDREN */;
    }
    if (vnode.shapeFlag & 2 /* ShapeFLags.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* ShapeFLags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVnode(text) {
    return createVnode(Text$1, {}, text);
}
function getShapeFlay(type) {
    return typeof type === "string"
        ? 1 /* ShapeFLags.ELEMENT */
        : 2 /* ShapeFLags.STATEFUL_COMPONENT */;
}

const initProps = (instance, props) => {
    instance.props = props;
};

const initEmit = (instance, event, ...arg) => {
    const { props } = instance;
    const handleKeyName = toHandleName(capitalize(event));
    props[handleKeyName] && props[handleKeyName](...arg);
};
const capitalize = (name) => {
    return (name && name[0].toUpperCase() + name.slice(1)) || "";
};
const toHandleName = (eventName) => {
    return (eventName && `on${capitalize(eventName)}`) || "";
};

const extend = Object.assign;
const isObject = (value) => {
    return value !== null && typeof value === "object";
};

const targetMap = new Map();
const triggerEffect = (target, key) => {
    const maps = targetMap.get(target);
    const effects = maps.get(key);
    triggerActionEffect(effects);
};
const triggerActionEffect = (effects) => {
    for (let effect of effects) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
};

const createGetter = (isReadonly = false, isShallow = false) => {
    return (target, key) => {
        if (key === "_IS_REACTIVE" /* reactiveFlag.ISREACTIVE */)
            return !isReadonly;
        if (key === "_IS_READONLY" /* reactiveFlag.ISREADONLU */)
            return !!isReadonly;
        const result = Reflect.get(target, key);
        if (isShallow)
            return result;
        if (isObject(result)) {
            return (isReadonly && readonly(result)) || reactive(result);
        }
        return result;
    };
};
const createSetter = (isReadonly = false) => {
    return (target, key, value) => {
        if (isReadonly) {
            console.warn(`${key.toString()} set fail,because the ${key} is readonly`);
            return true;
        }
        const result = Reflect.set(target, key, value);
        triggerEffect(target, key);
        return result;
    };
};
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set: readonlySet,
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

const reactive = (raw = {}) => {
    return createProxyObject(raw, mutableHandlers);
};
const readonly = (raw = {}) => {
    return createProxyObject(raw, readonlyHandlers);
};
const shallowReadonly = (raw = {}) => {
    return createProxyObject(raw, shallowReadonlyHandlers);
};
const createProxyObject = (raw, baseHandlers) => {
    if (!isObject(raw))
        return;
    return new Proxy(raw, baseHandlers);
};

const publicInstanceProxyMap = {
    $el: (i) => i.vnode.el,
    $slot: (i) => i.slots,
};
const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicInstanceProxyMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
        if (props[key]) {
            return props[key];
        }
    },
};

const initSlots = (instance, children) => {
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* ShapeFLags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
};
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        slots[key] = normalizeSlotValue(children[key]);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    const Component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { },
        slots: {},
    };
    Component.emit = initEmit.bind(null, Component);
    return Component;
}
function setupComponent(instance) {
    initProps(instance, shallowReadonly(instance.vnode.props));
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    if (setup) {
        const setupResult = setup(instance.props, { emit: instance.emit });
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
    const { shapeFlag, type } = vnode;
    switch (type) {
        case Fragment:
            processFragment(vnode.children, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & 1 /* ShapeFLags.ELEMENT */) {
                processElement(vnode, container);
            }
            if (shapeFlag & 2 /* ShapeFLags.STATEFUL_COMPONENT */) {
                processComponent(vnode, container);
            }
            break;
    }
}
function processFragment(vnode, container) {
    mountElementChildren(vnode, container);
}
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
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
function processComponent(vnode, container) {
    mountComponent(vnode, container);
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
    patch(subTree, container);
    initialVnode.el = subTree;
}

const createApp = (rootComponent) => {
    return {
        mount: (rootContainer) => {
            let root = document.querySelector(rootContainer);
            const vnode = createVnode(rootComponent);
            if (!root) {
                root = document.createElement("div");
                root.id = rootContainer.replace("#", "");
                document.body.append(root);
            }
            render(vnode, root);
        },
    };
};

function h(type, props, children) {
    return createVnode(type, props, children);
}

const renderSlots = (slots, name) => {
    const slot = slots[name];
    if (slot) {
        return createVnode(Fragment, {}, slot);
    }
};

export { createApp, createTextVnode, h, renderSlots };
