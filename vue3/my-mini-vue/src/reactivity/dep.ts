import { ReactiveEffect } from "./effect"

export type Dep = Set<ReactiveEffect> & TrackedMarkers

type TrackedMarkers = {
  w: number
  n: number
}

export const createDep = (effects?: []):Dep => {
  const dep = new Set<unknown>(effects) as Dep
  dep.w = 0
  dep.n = 0

  return dep
}