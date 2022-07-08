import { h } from "../../dist/esm/index.js";
import { Foo } from "./Foo.js";

export default {
  name: "App",
  render() {
    const app = h("p", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: h("p", "", "header"),
        footer: h("p", "", "footer"),
      }
    );

    return h("div", { class: "red" }, [app, foo]);
  },

  setup() {
    return {};
  },
};
