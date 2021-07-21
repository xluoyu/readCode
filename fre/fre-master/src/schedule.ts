/**
 * 以时间切片的形式执行传入的回调数组
 * 
 * 入口为schedule
 * 调用schedule传入一个回调函数，将函数添加到queue中
 * 添加一个动态flush(时间切片), 在下一个事件循环中执行(setTimeout || postMessage)
 * 
 * flush： 
 * 通过while循环从queue中获取回调函数，执行、删除(shift)、获取下一个。
 * 每次循环时，判断可执行状态(事件本身、用户输入状态、事件执行帧)
 * 在循环结束时，再次添加flush，开启下一次循环
 */

import { ITask } from "./type"
import { options } from "./reconcile"

const queue: ITask[] = []
const threshold: number = 1000 / 60 // 1帧
const transitions = []
let deadline: number = 0

// 在transitions中添加回调
export const startTransition = (cb) => {
  transitions.push(cb) && postMessage()
}

// 在队列中添加一个callback
export const schedule = (callback: any): void => {
  queue.push({ callback } as any)
  startTransition(flush)
}

const postMessage = (() => {
  // 执行cb就是执行flush
  const cb = () => transitions.splice(0, 1).forEach((c) => c())

  /**
   * postMessage和setTimeout都属于宏任务
   * 但是postMessage要比time要快
   * 即使setTimeout设置为0也会有延迟
   */
  if (typeof MessageChannel !== "undefined") {
    // 创建消息通道
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }

  return () => setTimeout(cb)
})()

const flush = (): void => {
  deadline = getTime() + threshold
  let job = peek(queue)
  while (job && !shouldYield()) {
    const { callback } = job as any
    job.callback = null
    const next = callback()
    if (next) {
      job.callback = next as any
    } else {
      queue.shift()
    }
    job = peek(queue)
  }
  job && startTransition(flush)
}

export const shouldYield = (): boolean => {
  if (options.sync) return false
  return (
    // 检测用户是否输入 || 执行时间大于1帧
    (navigator as any)?.scheduling?.isInputPending() || getTime() >= deadline
  )
}

export const getTime = () => performance.now()

const peek = (queue: ITask[]) => queue[0]
