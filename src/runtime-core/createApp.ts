import { render } from "./render";
import { createVnode } from "./vnode";

export const createApp = (rootComponent: any) => {
  return {
    mount: (rootContainer: string) => {
      const root = document.querySelector(rootContainer);
      const vnode = createVnode(rootComponent);

      render(vnode, root);
    },
  };
};
