class ReactiveEffect {
  private _effectFn: () => void;
  public scheduler: Function | undefined;

  constructor(fn: any, scheduler?: Function) {
    this._effectFn = fn;
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this as any;
    return this._effectFn();
  }
}

let activeEffect = void 0;
const targetMap = new Map();

export const collectionEffect = (target, key) => {
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

  deps.add(activeEffect);
};

export const triggerEffect = (target, key) => {
  const maps = targetMap.get(target);
  const effects = maps.get(key);

  for (let effect of effects) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run && effect.run();
    }
  }
};

export const effect = (fn: () => void, options = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  return runner;
};
