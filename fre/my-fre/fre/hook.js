import { getCurrentFiber, isFn, update } from "./reconcile"

let cursor = 0
export const resetCursor = () => {
  cursor = 0
}

export const useState = (initState) => {
  return useReducer(null, initState)
}

export const useReducer = (reducer, initState) => {
  const [hook, current] = getHook(cursor++)
  return [
    hook.length == 0 ? (hook[0] = initState) : hook[0],
    (value) => {
      hook[0] = reducer ? reducer(hook[0], value) :
        isFn(value) ? value(hook[0]) : value
      update(current)
    }
  ]
}

export const useMemo = (cb, deps) => {
  
}

export const getHook = (cursor) => {
  const current = getCurrentFiber()
  const hooks = current.hooks || (current.hooks = {list: [], effect: [], layout: []})
  if (cursor >= hooks.list.length) {
    hooks.list.push([])
  }
  return [hooks.list[cursor], current]
}