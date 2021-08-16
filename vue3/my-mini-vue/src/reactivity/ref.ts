import { trackEffects, triggerEffects } from './effect';
import { Dep, createDep } from './dep';
interface Ref<T = any> {
  value: T
}

type RefBase<T> = {
  dep?: Dep
  value: T
}

export function trackRefValue(ref: RefBase<any>) {
  // ref = toRaw(ref)
  if (!ref.dep) {
    // 存储依赖用的set组
    ref.dep = createDep()
  }

  trackEffects(ref.dep)
}

export function triggerRefValue(ref: RefBase<any>, newVal?: any) {
  triggerEffects(ref.dep!)
}

class RefImpl<T> {
  private _value: T
  // private _rawValue: T

  constructor(value: T) {
    this._value = value
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    this._value = newVal
    triggerRefValue(this, newVal)
  }
}

function createRef (rawValue: unknown) {
  return new RefImpl(rawValue)
}

export function ref<T = any>(value: T): Ref<T | undefined>
export function ref(value?: unknown) {
  return createRef(value)
}