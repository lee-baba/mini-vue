const publicInstanceProxyMap: any = {
  $el: (i: any) => i.vnode.el,
};

export const publicInstanceProxyHandlers = {
  get({ _: instance }: any, key: any) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    const publicGetter = publicInstanceProxyMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
