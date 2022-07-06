import { h } from "../../dist/esm/index.js";
window.self = null;
export default {
  render() {
    window.self = this;
    return h(
      "div",
      {
        class: "red",
        onClick: () => console.log("123", 123),
        onMousedown: () => console.log("321", 321),
      },
      this.msg
    );
  },
  setup() {
    return {
      msg: "hello word",
    };
  },
};
