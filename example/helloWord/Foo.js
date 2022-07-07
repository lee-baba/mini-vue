import { h } from "../../dist/esm/index.js";

export default {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit("add", 1, 2);
    };

    return {
      emitAdd,
    };
  },

  render() {
    return h(
      "div",
      {
        onClick: () => {
          console.log("add");
          this.emitAdd();
        },
      },
      "hi, foo" + this.count
    );
  },
};
