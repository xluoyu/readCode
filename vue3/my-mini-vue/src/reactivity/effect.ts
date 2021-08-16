import { isArray } from '../shared';
import { Dep } from './dep';

// 当前活动的effect
let activeEffect: ReactiveEffect | undefined
const effectStack: ReactiveEffect[] = []

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []

  // can be attached after creation
  computed?: boolean
  allowRecurse?: boolean
  onStop?: () => void
  // dev only
  onTrack?: (event: any) => void
  // dev only
  onTrigger?: (event: any) => void

  constructor(
    public fn: () => T,
  ) {

  }

  run () {
    if (!this.active) {
      return this.fn()
    }
    if (!effectStack.includes(this)) {
      try {
        effectStack.push((activeEffect = this))

        return this.fn()
      } finally {
        effectStack.pop()

        const n = effectStack.length
        // n > ？ 说明还有上一层effect，activeEffect进入上一层
        activeEffect = n > 0 ? effectStack[n - 1] : undefined
      }
    }
  }

  stop () {
    if (this.active) {

      cleanupEffect(this)

      this.active = false
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  // 把effect中的deps全部删掉
  const { deps } = effect
  if (deps.length) {
    for(let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }

    deps.length = 0
  }
}

// 搜集依赖
/**
 * ref的dep中添加当前的effect
 * 
 * 当前的effect的deps添加上触发的dep
 * 
 * 双向添加
 * @param dep 
 */
export function trackEffects (
  dep: Dep
) {
  // let shouldTrack = false

  // 查看dep里是否包含了当前活跃的effect
  let shouldTrack = !dep.has(activeEffect!)

  if (!shouldTrack) return

  console.log('搜集依赖')
  dep.add(activeEffect!)
  activeEffect!.deps.push(dep)
}

export function effect<T = any>(
  fn: () => T,
  options?: any
) {
  const _effect = new ReactiveEffect(fn)

  if (options) {
    // 按配置执行操作
    // extend(_effect, options)
  }

  // 在没有设置lazy时，直接执行fn
  if (!options || !options.lazy) {
    _effect.run()
  }


  // 返回一个runnner，给用户
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect

  return runner

}

// 搜集依赖用
/**
 * 在触发set时调用
 * 传入触发的ref的dep
 */
export function triggerEffects (
  dep: Dep | ReactiveEffect[]
) {
  /**
   * 遍历ref中的所有dep
   * 
   * 排除掉当前触发的effect，避免死循环
   */
  for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect !== activeEffect) {
      effect.run()
    }
  }
}