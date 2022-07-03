import { isReactive, reactive } from "./../reactivity/reactive";

describe("reacitve", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(original).not.toBe(observed);
    expect(observed.foo).toBe(1);
  });

  it("isReactive", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });
});
