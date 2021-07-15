import { ICurTree, IVueComponent } from '../type';
import { watchEffect } from '../reactivity/index';

export function runComponent(component: IVueComponent, el: HTMLElement | undefined) {
  
  let rootContext = component.setup ? component.setup() : {}

  // let values = rootContext ? Object.keys(rootContext).reduce((pre, key) => {
  //   pre[key] = rootContext[key].value
  //   return pre
  // }, {}) : {}
  
  watchEffect(() => {
    vNode(component.render(rootContext), el)
  })
}

export function vNode (curTree: ICurTree, el: HTMLElement) {
  let {type, props, children} = curTree
  let curEl: HTMLElement
  if (typeof type === 'string') {
    curEl = curTree.curEl = document.createElement(type)
  } else {
    runComponent(type as IVueComponent, el)
    return
  }

  if (props) {
    Object.keys(props).forEach(key => {
      curEl.setAttribute(key, props[key])
    })
  }

  if (typeof children === "string") {
    let childNode = document.createTextNode(children)
    curEl.append(childNode)
  } else if (Array.isArray(children)) {
    children.forEach(item => {
      vNode(item, curEl)
    })
  }

  el.append(curEl)
}