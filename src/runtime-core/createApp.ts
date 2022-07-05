import { render } from "./render";
import { createVnode } from "./vnode";

export const createApp = (rootComponent: any) => {
  return {
    mount: (rootContainer: any) => {
      const vnode = createVnode(rootComponent);

      render(vnode, rootContainer);
    },
  };
};
