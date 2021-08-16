/**
 * 工具库
 */

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isArray = Array.isArray

export const isObject = (val: unknown): val is object => typeof val === 'object'