export function createVnode(type: any, props?: any, children?: any) {
  const component = {
    type,
    props,
    children,
  };
  return component;
}
