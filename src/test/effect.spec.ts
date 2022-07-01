import { effect } from "./../reactivity/effect";
import { reactive } from "./../reactivity/reactive";

describe("reactivity", () => {
  it("happy path", () => {
    const user = reactive({ age: 17 });

    let nextAge;

    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(18);

    user.age++;
    expect(nextAge).toBe(19);
  });

  it("run effect should return a runner", () => {
    let age = 17;
    const runner = effect(() => {
      age++;
      return "running";
    }) as any;

    expect(age).toBe(18);
    runner();
    expect(age).toBe(19);
    expect(runner()).toBe("running");
  });

  it("scheduler", () => {
    let dummy;
    let run: any;

    const obj = reactive({ foo: 1 });

    const scheduler = jest.fn(() => {
      run = runner;
    });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
});