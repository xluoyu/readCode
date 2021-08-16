import { Deps } from './deps';

let currentHook: Function | null = null

export const ref = (initState: any) => {
  let dep = new Deps(initState)
  return dep
}

export const watch = (obj: () => any, cb: any) => {
  let key
  if (isFn(obj)) {
    key = obj()
  } else {
  }
}

export const watchEffect = (cb) => {
  currentHook = cb
  cb()
  // currentHook = null
}

export const getCurrent = () => currentHook
const isFn = (obj: any) => typeof obj === "function"