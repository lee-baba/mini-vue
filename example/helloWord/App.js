import { h } from "../../dist/esm/index.js";
import Foo from "./Foo.js";
window.self = null;
export default {
  render() {
    window.self = this;
    return h(
      "div",
      {
        class: "red",
        // onClick: () => console.log("123", 123),
        // onMousedown: () => console.log("321", 321),
      },
      [
        h("div", {}, "hi, app"),
        h(Foo, {
          count: 1,
          onAdd(a, b) {
            console.log("onAdd", a, b);
          },
        }),
      ]
    );
  },
  setup() {
    return {
      msg: "hello word",
    };
  },
};
