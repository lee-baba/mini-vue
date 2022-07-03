import { isReadonly } from "./../reactivity/reactive";
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

  it("isReadonly", () => {
    const obj = { foo: 1 };
    const readonlyObj = readonly(obj);

    expect(isReadonly(readonlyObj)).toBe(true);
    expect(isReadonly(obj)).toBe(false);
  });
});
