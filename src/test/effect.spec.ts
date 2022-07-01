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
});
