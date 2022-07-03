import { readonly } from "../reactivity/reactive";

describe("readonly ", () => {
  it("happy path", () => {
    const obj = { foo: 1 };
    const readonlyObj = readonly(obj) as any;
    expect(readonlyObj).not.toBe(obj);
    expect(readonlyObj.foo).toBe(1);
  });

  it("setting failed", () => {
    const obj = { foo: 1 };
    const readonlyObj = readonly(obj) as any;
    console.warn = jest.fn();
    readonlyObj.foo = 2;

    expect(console.warn).toBeCalled();
  });
});
