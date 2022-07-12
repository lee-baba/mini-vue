import { createRenderer } from "../runtime-core";
function createElement(type: any) {
  return document.createElement(type);
}

function patchProps(el: any, key: any, val: any) {
  const hasOn = (key: string) => /^on[A-Z]/.test(key);

  if (hasOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAtttibute(key, val);
  }
}

function insert(el: any, parent: any) {
  parent.append(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
});

export function createApp(...args: any) {
  return renderer.createApp(...args);
}

export * from "../runtime-core/index";
