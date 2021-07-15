import { Deps } from './deps';

let currentHook = null
let currentComponent = null

export const ref = (initState) => {
  let dep = new Deps(initState, currentComponent)
  return dep
}

export const watch = (obj, cb) => {
  let key
  if (isFn(obj)) {
    key = obj()
  } else {
  }
}

export const watchEffect = (cb) => {
  currentHook = cb
  cb()
  currentHook = null
}

export const getCurrent = () => currentHook
const isFn = (obj: any) => typeof obj === "function"