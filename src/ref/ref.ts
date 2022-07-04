import { trackEffect, triggerAction } from "../reactivity/effect";

class RefImpt {
  private _value: any;
  dep = new Map();
  constructor(value: any) {
    this._value = value;
  }

  public get value(): any {
    trackEffect(this.dep, this);
    return this._value;
  }
  public set value(value: any) {
    if (this._value === value) return;
    this._value = value;
    const dep = this.dep.get(this);
    triggerAction(dep);
  }
}

export const ref = (value: any) => {
  return new RefImpt(value);
};
