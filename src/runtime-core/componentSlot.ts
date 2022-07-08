import { ShapeFLags } from "../shared/ShapeFlags";

export const initSlots = (instance: any, children: any) => {
  const { vnode } = instance;

  if (vnode.shapeFlag & ShapeFLags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
};

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    slots[key] = normalizeSlotValue(children[key]);
  }
}

function normalizeSlotValue(value: any) {
  return Array.isArray(value) ? value : [value];
}
