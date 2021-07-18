import { IVueComponent } from '../type'
import {runComponent} from './vNode'

export function createApp(rootComponent: IVueComponent) {
  return {
    mount (root: string) {
      const rootEl = document.querySelector(root) as (HTMLElement | null)
      if (!rootEl) {
        throw new Error('无效的dom节点')
      }
      runComponent(rootComponent, rootEl)
    }
  }
}