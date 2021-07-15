import { componentEffect } from '../reactivity'
import { IVueComponent } from '../type'
import {vNode, runComponent} from './vNode'

export function createApp(rootComponent: IVueComponent) {
  return {
    mount (root: string) {
      const rootEl = document.querySelector(root) as (HTMLElement | null)
      if (!rootEl) {
        throw new Error('无效的dom节点')
      }
      // watchEffect(() => {
      // componentEffect(() => {
      runComponent(rootComponent, rootEl)
      // })
        // const curTree = 
        // vNode(curTree, rootEl)
      // })
      

      // rootEl.append(node)
    }
  }
}