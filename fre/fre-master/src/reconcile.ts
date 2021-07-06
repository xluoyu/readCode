import {
  IFiber,
  FreElement,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  IEffect,
} from "./type"
import { createElement } from "./dom"
import { resetCursor } from "./hook"
import { schedule, shouldYield, startTransition } from "./schedule"
import { isArr, createText } from "./h"
import { commit } from "./commit"

let currentFiber: IFiber
let finish = null
let effect = null
let detach = null
export let options: any = {}

export const enum LANE {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
}

// export const enum LANE {
//   UPDATE = 'update',
//   INSERT = 'insert',
//   REMOVE = 'remove',
//   SVG = 'svg',
//   DIRTY = 'dirty',
// }


//vnode jsx节点
// node 注入用的dom节点 #app
export const render = (vnode: FreElement | any, node: Node, config?: any): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
  if (config) options = config
  update(rootFiber)
}

/**
 * 更新dom的入口
 * 启用时间切片
 */
export const update = (fiber?: IFiber) => {
  console.log('update')
  if (fiber && !(fiber.lane & LANE.DIRTY)) {
    // 对fiber添加lane属性 2 / 32
    fiber.lane = LANE.UPDATE | LANE.DIRTY
    schedule(() => {
      effect = detach = fiber
      reconcile(fiber)
    })
  }
}

/**
 * 循环dom子节点
 * 
 */
const reconcile = (WIP?: IFiber): boolean => {
  while (WIP && !shouldYield()) WIP = capture(WIP)
  if (WIP) return reconcile.bind(null, WIP)
  if (finish) {
    console.log(finish)
    commit(finish)
    finish = null
    options.done && options.done()
  }
  return null
}


/**
 * 判断当前节点是组件(函数类型), 还是常规dom(div、span、p之类)
 * 针对不同类型执行不同操作hook、host,走diff算法
 * 如有子节点则返回子节点
 * 
 * 没有子节点
 */
const capture = (WIP: IFiber): IFiber | undefined => {
  WIP.isComp = isFn(WIP.type)
  // 执行不同操作
  WIP.isComp ? updateHook(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    bubble(WIP)
    if (!finish && WIP.lane & LANE.DIRTY) {
      finish = WIP
      WIP.lane &= ~LANE.DIRTY
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const bubble = (WIP) => {
  if (WIP.isComp) {
    let kid = getKid(WIP)
    if (kid) {
      kid.s = WIP.sibling
      kid.lane |= WIP.lane
    }
    invokeHooks(WIP)
  } else {
    WIP.s = WIP.sibling
    effect.e = WIP
    effect = WIP
  }
}

/**
 * 组件类型
 */
const updateHook = <P = Attributes>(WIP: IFiber): void => {
  // 初始化组件 - 添加标记
  resetCursor()
  currentFiber = WIP
  // WIP.type为组件创建函数
  // 传入props执行创建函数 生成子模块(vdom)
  let children = (WIP.type as FC<P>)(WIP.props)
  diffKids(WIP, simpleVnode(children))
}

/**
 * 普通dom节点
 */
const updateHost = (WIP: IFiber): void => {
  WIP.parentNode = getParentNode(WIP) as any
  if (!WIP.node) {
    if (WIP.type === "svg") WIP.lane |= LANE.SVG
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  // console.log('普通节点')
  diffKids(WIP, WIP.props.children)
}

const simpleVnode = (type: any) =>{
  return isStr(type) ? createText(type as string) : type}

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!WIP.isComp) return WIP.node
  }
}

export const getKid = (WIP: IFiber) => {
  while ((WIP = WIP.child)) {
    if (!WIP.isComp) return WIP
  }
}

/**
 * diff
 * 
 */
const diffKids = (WIP: any, children: FreNode): void => {
  console.log('-----------开始diff------------')
  console.log(WIP)
  let aCh = WIP.kids || [], // 首次进入时，WIP没有kids属性
    bCh = (WIP.kids = arrayfy(children) as any),
    aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    keyed = null

  while (aHead <= aTail && bHead <= bTail) {
    // 判断两个节点是否相同
    // 从后往前
    // 不相同 break 抛出
    if (!same(aCh[aTail], bCh[bTail])) break
    // 相同的话走clone
    console.log('---------------相同----------------')
    console.log(aCh[aTail], bCh[bTail])
    clone(aCh[aTail--], bCh[bTail], LANE.UPDATE, WIP, bTail--)
  }

  while (aHead <= aTail && bHead <= bTail) {
    // 从前往后
    if (!same(aCh[aHead], bCh[bHead])) break
    // 相同的话向后进行
    aHead++; bHead++
  }
  console.log('aCh', aCh)
  console.log('bCh', bCh)

  if (aHead > aTail) {
    while (bHead <= bTail) {
      // 针对没有aCh
      console.log('aHead > aTail && bHead <= bTail')
      let c = bCh[bTail]
      c.lane = LANE.INSERT
      linke(c, WIP, bTail--)
    }
  } else if (bHead > bTail) {
    while (aHead <= aTail) {
      console.log('bHead > bTail && aHead <= aTail')
      let c = aCh[aTail--]
      c.lane = LANE.REMOVE
      detach.d = c
      detach = c
    }
  } else {
    console.log('else')
    if (!keyed) {
      keyed = {}
      for (let i = aHead; i <= aTail; i++) {
        let k = aCh[i].key || '.' + i
        if (k) keyed[k] = i
      }
    }
    while (bHead <= bTail) {
      let c = bCh[bTail]
      let idx = keyed[c.key || '.' + bTail]
      if (idx != null && same(c, aCh[idx])) {
        clone(aCh[idx], c, LANE.INSERT, WIP, bTail--)
        delete keyed[c.key]
      } else {
        c.lane = LANE.INSERT
        linke(c, WIP, bTail--)
      }
    }

    for (const k in keyed) {
      let c = aCh[keyed[k]]
      c.lane = LANE.REMOVE
      detach.d = c
      detach = c
    }
  }

  while (bHead-- > 0) {
    console.log('bHead-- > 0')
    clone(aCh[bHead], bCh[bHead], LANE.UPDATE, WIP, bHead)
  }
}

function linke(kid, WIP, i) {
  kid.parent = WIP
  if (i === WIP.kids.length - 1) {
    if (WIP.lane & LANE.SVG) {
      kid.lane |= LANE.SVG
    }
    WIP.child = kid
  } else {
    WIP._prev.sibling = kid
  }
  WIP._prev = kid
}

function clone(a, b, lane, WIP, i) {
  b.oldProps = a.props
  b.node = a.node
  b.kids = a.kids
  b.hooks = a.hooks
  b.ref = a.ref
  b.lane = lane
  linke(b, WIP, i)
}

function invokeHooks(fiber) {
  const { hooks } = fiber
  if (hooks) {
    side(hooks.layout)
    startTransition(() => side(hooks.effect))
  }
}

const same = (a, b) => {
  return a && b && a.key === b.key && a.type === b.type
}

export const arrayfy = (arr) => (!arr ? [] : isArr(arr) ? arr : [arr])

const side = (effects: IEffect[]): void => {
  effects.forEach((e) => e[2] && e[2]())
  effects.forEach((e) => (e[2] = e[0]()))
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === "function"
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"
