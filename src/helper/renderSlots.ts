import { createVnode } from "../runtime-core/vnode";

export const renderSlots = (slots: any, name: string) => {
  const slot = slots[name];

  if (slot) {
    return createVnode("div", {}, slot);
  }
};
