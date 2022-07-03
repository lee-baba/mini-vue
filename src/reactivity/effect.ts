// 是否需要收集依赖
let shouleCollectionEffect = true;
class ReactiveEffect {
  private _effectFn: () => void;
  public scheduler: Function | undefined;
  deps = [];
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
    activeEffect = this as any;
    return this._effectFn();
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    shouleCollectionEffect = false;
    cleanDepEffect(this);
  }
}

const cleanDepEffect = (effect: ReactiveEffect) => {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
};

let activeEffect = void 0;
const targetMap = new Map();

const isCollection = () => {
  return activeEffect !== undefined && shouleCollectionEffect;
};

export const collectionEffect = (target: any, key: any) => {
  if (!isCollection()) return;
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
  (activeEffect as any).deps.push(deps);
};

export const triggerEffect = (target: any, key: any) => {
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

export const stop = (runner: any) => {
  runner.effect.stop();
};

export const effect = (fn: () => void, options = {} as any) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};
