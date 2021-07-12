import {schedule, shouldYield} from './schedule'

let currentFiber = null
let finish = null
let effect = null
let detach = null

export const type = {
  UPDATE: 'update',
  INSERT: 'insert',
  REMOVE: 'remove',
  DIRTY: 'dirty'
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
}

const capture = (WIP) => {
  WIP.isComp = isFn(WIP.type)
  console.log(WIP)
  
  WIP.isComp ? updateHook(WIP): updateHost(WIP)
  if (WIP.child) return WIP.child
  
}

const updateHook = (WIP) => {

}

const updateHost = (WIP) => {
  WIP.parentNode = getParentNode(WIP)
  if (!WIP.node) {
    WIP.node = createElement(WIP)
  }
  diffKids(WIP, WIP.props.children)
}

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
      console.log('aHead > aTail && bHead <= bTail')
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

const isFn = (obj) => typeof obj === "function"
const isStr = (obj) => typeof obj === "string"
const same = (a, b) => a && b && a.key === b.key && a.type === b.type
const arrayfy = (obj) => !obj ? [] : Array.isArray(obj) ? obj : [obj]