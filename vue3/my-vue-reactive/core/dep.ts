
export type Dep = Set<unknown> & TrackedMarkers

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