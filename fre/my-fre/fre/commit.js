import { updateElement } from './dom'
import {getKid, type} from './reconcile'

export const commit = (fiber) => {
  let d = fiber
  let e = d.e
  fiber.e = null // 将根节点的e清空
  do {
    insert(e)
  } while(e = e.e)
  // while (d = d.d) remove
  fiber.d = null
}

const insert = (fiber) => {
  let s = fiber.s
  if (s) {
    // 邻节点
    if (s.isComp) {
      s = getKid(s)
    }
    s.prev = fiber
  }
  if (fiber.lane == type.UPDATE) {
    updateElement(fiber.node, fiber.oldProps || {}, fiber.props)
  }
  if (fiber.lane == type.INSERT) {
    const after = fiber.prev?.node || null
    fiber.parentNode.insertBefore(fiber.node, after)
  }
}