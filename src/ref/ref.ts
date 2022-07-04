import { reactive } from "./../reactivity/reactive";
import { hasChange, isObject } from "./../shared/index";
import {
  canCollect,
  trackEffect,
  triggerActionEffect,
} from "../reactivity/effect";

class RefImpt {
  private _value: any;
  dep;
  public _is_ref = true;
  private _rawValue: any;
  constructor(value: any) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  public get value(): any {
    collectRefValue(this);
    return this._value;
  }

  public set value(newValue: any) {
    if (hasChange(newValue, this._rawValue)) {
      this._value = convert(newValue);
      this._rawValue = newValue;
      triggerActionEffect(this.dep);
    }
  }
}

const convert = <T>(value: T) => {
  return (isObject(value) && reactive(value)) || value;
};

const collectRefValue = (ref: RefImpt) => {
  if (canCollect()) {
    trackEffect(ref.dep);
  }
};

export const ref = (value: any) => {
  return new RefImpt(value);
};

export const isRef = (ref: RefImpt | any) => {
  return !!ref._is_ref;
};

export const unRef = (ref: RefImpt | any) => {
  return (isRef(ref) && ref.value) || ref;
};
