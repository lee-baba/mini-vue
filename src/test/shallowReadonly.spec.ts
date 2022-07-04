import { isReadonly, shallowReadonly } from "../reactivity/reactive";

describe("shallowReadonly", () => {
  it("happy path", () => {
    const obj = { foo: 1, baz: { abc: 1 } };
    const shallowReadonlyObj = shallowReadonly(obj);

    expect(isReadonly(shallowReadonlyObj)).toBe(true);
    expect(isReadonly(shallowReadonlyObj.baz)).toBe(false);

    shallowReadonlyObj.baz.abc = 3;
    expect(shallowReadonlyObj.baz.abc).toBe(3);
  });

  it("set fail", () => {
    const obj = { foo: 1, baz: { abc: 1 } };
    const shallowReadonlyObj = shallowReadonly(obj);
    console.warn = jest.fn();

    shallowReadonlyObj.foo = 2;
    expect(console.warn).toBeCalled();
  });
});
