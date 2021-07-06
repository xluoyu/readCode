const queue:any[] = [] // 用于储存任务队列
const transitions:any[] = [] // 任务块
let deadline = 0
let oneFrame = 1000 / 60

const getTime = () => performance.now()

export const schedule = (callback: any):void => {
  queue.push({callback})
  startTransition(flush)
}

export const startTransition = (cb:any) => {
  transitions.push(cb) && postMessage()
}

const postMessage = (() => {
  const cb = () => transitions.splice(0, 1).forEach(e => e())

  if (typeof MessageChannel !== 'undefined') {
    const {port1, port2} = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }

  return () => setTimeout(cb)
})()

const flush = () => {
  console.log('开始执行')
  console.log(performance.now())

  deadline = getTime() + oneFrame
  let job = queue[0]
  while (job && !shouldYield()) {
    const {callback} = job
    job.callback = null
    const next = callback()
    if (next) {
      job.callback = next
    } else {
      queue.shift()
    }
    job = queue[0]
  }
  job && startTransition(flush)
}

// 用户在输入 或 执行时间大于一帧，返回true 须停止后续操作
const shouldYield = ():boolean => (navigator as any)?.scheduling?.isInputPending() || getTime() >= deadline