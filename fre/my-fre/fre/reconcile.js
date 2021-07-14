import {schedule, shouldYield} from './schedule'
import {createElement} from './dom'
import {commit} from './commit'
import { resetCursor} from './hook'

let currentFiber = null
let finish = null
let effect = null
let detach = null

export const type = {
  UPDATE: 'update',
  INSERT: 'insert',
  REMOVE: 'remove',
  DIRTY: 'dirty',
  ROOT: 'root'
}

// 入口
export const render = (vnode, node) => {
  const rootFiber = {
    node,
    props: { children: vnode },
  }
  update(rootFiber)
}

/**
 * 更新
 * @param {*} fiber 
 */
export const update = (fiber) => {
  if (fiber) {
    fiber.lane = type.ROOT
    schedule(() => {
      effect = detach = fiber
      reconcile(fiber)
    })
  }
}

const reconcile = (WIP) => {
  while(WIP && !shouldYield()) {
    WIP = capture(WIP)
  }
  if (WIP) return reconcile.bind(null, WIP)
  if (finish) {
    commit(finish)
    finish = null
  }
  return null
}

const capture = (WIP) => {
  WIP.isComp = isFn(WIP.type)
  
  WIP.isComp ? updateHook(WIP): updateHost(WIP)
  if (WIP.child) return WIP.child
  while(WIP) {
    bubble(WIP)
    if (!finish && WIP.lane == type.ROOT) {
      finish = WIP
      WIP.lane = null
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

/**
 * effect = root
 * 遍历到没有子节点的节点时
 * 在effect.e中储存本节点
 * effect变为当前节点
 * 
 * 从root直到第一个没有子节点的节点，然后便利nextsibling
 * 全部遍历完后，由最后一个节点向上便利
 * lastWIP -> root
 * 最后effect变为root
 * 
 * 
 */
const bubble = (WIP) => {
  if (WIP.isComp) {
    let kid = getKid(WIP)
    if (kid) {
      kid.s = WIP.sibling
      kid.lane = WIP.lane
    }
    // inv
  } else {
    WIP.s = WIP.sibling
    effect.e = WIP
    effect = WIP
  }
}

// 组件
const updateHook = (WIP) => {
  resetCursor()
  currentFiber = WIP
  // 执行组件方法
  let children = WIP.type(WIP.props)
  diffKids(WIP, children)
}

const updateHost = (WIP) => {
  WIP.parentNode = getParentNode(WIP)
  if (!WIP.node) {
    WIP.node = createElement(WIP)
  }
  diffKids(WIP, WIP.props.children)
}

// const simpleVnode = (type) =>{
//   return isStr(type) ? createText(type) : type}

const diffKids = (WIP, children) => {
  let oldKids = WIP.kids || [],
      newKids = WIP.kids = arrayfy(children),
      oldHead = 0,
      newHead = 0,
      oldTail = oldKids.length - 1,
      newTail = newKids.length - 1,
      keyed = null
  while (oldHead <= oldTail && newHead <= newTail) {
    if (!same(oldKids[oldTail], newKids[newTail])) break
    // 节点相同
    clone(oldKids[oldTail--], newKids[newTail], type.UPDATE, WIP, newTail--)
  }
  
  if (oldHead > oldTail) {
    while (newHead <= newTail) {
      // 新建节点
      let c = newKids[newTail]
      c.lane = type.INSERT
      linke(c, WIP, newTail--)
    }
  }

}

const getParentNode = (WIP) => {
  while((WIP = WIP.parent)) {
    if (!WIP.isComp) return WIP.node
  }
}

export const getKid = (WIP) => {
  while ((WIP = WIP.child)) {
    if (!WIP.isComp) return WIP
  }
}

export const getCurrentFiber = () => currentFiber || null

const linke = (kid, WIP, i) => {
  kid.parent = WIP
  if (i === WIP.kids.length - 1) {
    WIP.child = kid
  } else {
    WIP._prev.sibling = kid
  }
  WIP._prev = kid
}

const clone = (a, b, lane, WIP, i) => {
  b.oldProps = a.props
  b.node = a.node

  b.kids = a.kids
  b.hooks = a.hooks
  b.ref = a.ref
  b.lane = lane
  linke(b, WIP, i)
}

export const isFn = (obj) => typeof obj === "function"
export const isStr = (obj) => typeof obj === "string"
const same = (a, b) => a && b && a.key === b.key && a.type === b.type
const arrayfy = (obj) => !obj ? [] : Array.isArray(obj) ? obj : [obj]