


export const render = (vnode: FreElement | any, node: Node, config?: any): void => {
  console.log(vnode)
  const rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
}

export const test = <T, U>(first: T, second: U): T & U => {
  let res = <T & U>{}
  return res
}