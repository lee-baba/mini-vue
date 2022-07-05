export default {
  render() {
    return h("div", this.msg);
  },
  setup() {
    return {
      msg: "hello word",
    };
  },
};
