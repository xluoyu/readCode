import { ICurTree, IVueComponent } from '../type';
import { watchEffect } from '../reactivity/index';
import {scheduler} from './scheduler'

export function runComponent(component: IVueComponent, rootEl: HTMLElement | undefined) {
  
  let rootContext = component.setup ? component.setup() : {}
  typeof rootContext == 'object' && Object.keys(rootContext).forEach((key) => {
    if (component[key]) {
      throw new Error('重复的属性')
    }
    component[key] = rootContext[key]
  })

  component.oldTree = null
  
  watchEffect(() => {
    console.log('scheduler - before')

    scheduler(() => {
      console.log('scheduler - after')
      let newDom = component.render(rootContext)
      patch(component.oldTree, newDom, component, rootEl)
    })
  })
}

// diff算法
export function patch(n1, n2, component, rootEl) {
  if (!n1) {
    vNode(n2, component, rootEl)
    return
  } else {
    console.log(n1, n2)
    // 节点对比
    if (typeof n2.type === 'string' && n1.type !== n2.type) {
      rootEl.innerHTML = ''
      vNode(n2, component, rootEl)
      return
    }
    const el = n2.curEl = n1.curEl
    // props 对比
    diffProps(n1.props, n2.props, el)

    // children
    const {children: oldChildren} = n1
    const {children: newChildren} = n2

    if (typeof newChildren === 'string' && newChildren !== oldChildren) {
      el.innerText = newChildren
    } else if (Array.isArray(newChildren)) {
      const diffLength = Math.min(newChildren.length, oldChildren.length)
      
      for (let index = 0; index < diffLength; index++) {
        const newItem = newChildren[index];
        const oldItem = oldChildren[index];
        patch(oldItem, newItem, component, el)
      }
    }
  }
}

/**
 * 创建curTree dom
 * 在component中添加oldTree为
 */
export function vNode (curTree: ICurTree, component: IVueComponent, el: HTMLElement) {
  let {type, props, children} = curTree
  let curEl: HTMLElement
  if (typeof type === 'string') {
    curEl = curTree.curEl = document.createElement(type)
  } else {
    runComponent(type as IVueComponent, el)
    return
  }

  if (props) {
    diffProps({}, props, curEl)
  }

  if (typeof children === "string") {
    let childNode = document.createTextNode(children)
    curEl.append(childNode)
  } else if (Array.isArray(children)) {
    children.forEach(item => {
      vNode(item, component, curEl)
    })
  }
  component.oldTree = curTree
  el.append(curEl)
}

const diffProps = (oldProps, newProps, el) => {
  if (newProps) {
    Object.keys(newProps).forEach((key) => {
      if (newProps[key] !== oldProps[key]) {
        if (key[0] == 'o' && key[1] == 'n') {
          let eventName = key.substring(2).toLowerCase()
          if (!oldProps[key]) {
            el.addEventListener(eventName, newProps[key])
          }
        } else {
          el.setAttribute(key, newProps[key])
        }
      }
    })
  }
}