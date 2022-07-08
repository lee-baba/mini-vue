import { render } from "./render";
import { createVnode } from "./vnode";

export const createApp = (rootComponent: any) => {
  return {
    mount: (rootContainer: string) => {
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
