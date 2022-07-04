import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _dirty: Boolean = true;
  private _value: any;
  private _effect: ReactiveEffect;
  dep = new Set();
  constructor(getter: any) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}
export const computed = (getter: () => void) => {
  return new ComputedRefImpl(getter);
};
