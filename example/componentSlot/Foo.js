import { h, renderSlots } from "../../dist/esm/index.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    return h("div", {}, [
      renderSlots(this.$slot, "header"),
      h("div", {}, "11111111"),
      renderSlots(this.$slot, "footer"),
    ]);
  },
};
