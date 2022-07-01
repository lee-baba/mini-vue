class ReactiveEffect {
  private _effectFn: () => void;

  constructor(fn: any) {
    this._effectFn = fn;
  }
  run() {
    activeEffect = this as any;
    this._effectFn();
  }
}

let activeEffect = void 0;
const targetDepMaps = new Map();

export const collectionEffect = (target, key) => {
  let targetDeps = targetDepMaps.get(target);
  if (!targetDeps) {
    targetDeps = new Map();
    targetDepMaps.set(target, targetDeps);
  }

  let deps = targetDeps.get(key);
  if (!deps) {
    deps = new Set();
    targetDeps.set(key, deps);
  }

  deps.add(activeEffect);
};

export const triggerEffect = (target, key) => {
  const maps = targetDepMaps.get(target);
  const effects = maps.get(key);

  for (let effect of effects) {
    effect.run && effect.run();
  }
};

export const effect = (fn: () => void) => {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
};
