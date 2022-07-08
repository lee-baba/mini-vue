import { extend } from "../shared/index";

// 是否需要收集依赖
let shouleCollectionEffect = false;
export class ReactiveEffect {
  private _effectFn: () => void;
  public scheduler: Function | undefined;
  deps = [];
  onStop: (() => void) | undefined;
  // 避免多次执行stop
  isActive: Boolean = true;
  constructor(fn: any, scheduler?: Function) {
    this._effectFn = fn;
    this.scheduler = scheduler;
  }

  run() {
    if (!this.isActive) {
      return this._effectFn();
    }

    shouleCollectionEffect = true;
    activeEffect = this as any;
    const result = this._effectFn();

    shouleCollectionEffect = false;
    return result;
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    cleanDepEffect(this);
    this.onStop && this.onStop();
  }
}

const cleanDepEffect = (effect: ReactiveEffect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
};

let activeEffect = void 0;
const targetMap = new Map();

export const canCollect = () => {
  return activeEffect !== undefined && shouleCollectionEffect;
};

export const collectionEffect = (target: any, key: any) => {
  if (!canCollect()) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  trackEffect(deps);
};

export const trackEffect = (deps: any) => {
  deps.add(activeEffect);
  (activeEffect as any).deps.push(deps);
};

export const triggerEffect = (target: any, key: any) => {
  const maps = targetMap.get(target);
  const effects = maps.get(key);
  triggerActionEffect(effects);
};

export const triggerActionEffect = (effects: any) => {
  for (let effect of effects) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

export const stop = (runner: any) => {
  runner.effect.stop();
};

export const effect = (fn: () => void, options = {} as any) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};
