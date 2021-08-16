const queue:any[] = []
const transtions: any[] = []
const oneFrame = 1000 / 60 // 一帧
let deadline = 0 // 一帧的结束时间

export function scheduler(cb) {
  queue.push({cb})
  startTranstion(flush)
}

// 执行模块
const flush = () => {
  deadline = getTime() + oneFrame
  let job = queue[0]
  while (job && !shouldYield()) {
    // 可执行
    const {cb} = job
    job.cb = null
    const next = cb()
    if (next) {
      job.cb = next
    } else {
      queue.shift()
    }
    job = queue[0]
  }
  job && startTranstion(flush)
}

// 添加任务到下一个宏任务中
function startTranstion (cb) {
  transtions.push(cb)
  postMessage()
}

const postMessage = (() => {
  const runcb = () => {
    let cur = transtions.shift()
    cur && cur()
  }
  // const runcb = () => transtions.splice(0, 1).forEach(e => e())

  if (typeof MessageChannel !== 'undefined') {
    const {port1, port2} = new MessageChannel()
    port1.onmessage = runcb
    return () => port2.postMessage(null)
  }

  return () => setTimeout(runcb)
})()

const getTime = () => performance.now()
export const shouldYield = ():boolean => getTime() >= deadline