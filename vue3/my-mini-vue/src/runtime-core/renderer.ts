import { createAppAPI } from './apiCreateApp';
import { isSameVNodeType } from './vnode';
export function createRenderer(options) {
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options) {

  // diff
  const patch = (
    n1, 
    n2, 
    container,
    anchot = null,
    parentComponent = null,
    parentSUspense = null
  ) => {
    console.log(n2)
    // n1 与 n2 完全相同则跳过diff
    if (n1 === n2) return
    
    // 当有 n1 时
    // 判断 n1 与 n2 的type、key是否完全相同
    // 不相同则卸载n1，变为null
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1, parentComponent)
      n1 = null
    }

    const { type, ref, shapeFlag} = n2

    


  }

  // 卸载
  const unmount = (vnode, parentComponent) => {}
  /**
   * render 入口
   */
  const render = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }

    container._vnode = vnode
  }

  const hydrate = () => {

  }

  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  }
}