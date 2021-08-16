import { isObject } from '../shared/index';
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.RAW]?: any
}

const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2
}

export const reactiveMap = new WeakMap<Target, any>()


function createReactiveObject(
  target: Target,
  proxyMap: WeakMap<Target, any>
) {
  // 检查传入的值
  if (!isObject(target)) return target

  const targetType = getTargetType(target)

  // const proxy = new Proxy(
  //   target,
  //   targetType === TargetType
  // )

  // proxyMap.set(target,proxy)

  return target
}


export function reactive(target: object) {

  return createReactiveObject(
    target,
    reactiveMap
  )
}

function getTargetType(value: Target) {
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID
    : targetTypeMap(toRwaType(value))
}