import { isProxy, isReactive, reactive } from "./../reactivity/reactive";

describe("reacitve", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(original).not.toBe(observed);
    expect(observed.foo).toBe(1);
  });

  it("isReactive", () => {
    const original = { foo: 1, baz: { abc: 2 } };
    const observed = reactive(original);

    expect(isReactive(observed)).toBe(true);
    expect(isReactive(observed.baz)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });

  it("isProxy", () => {
    const original = { foo: 1, baz: { abc: 2 } };
    const observed = reactive(original);

    expect(isProxy(observed)).toBe(true);
  });
});
