let currentEffect
class Dep {
  constructor (val) {
    this.effects = new Set()
    this._val = val
  }

  get value() {
    this.depend()
    return this._val
  }

  set value(newVal) {
    this._val = newVal
    this.notice()
  }

  // 收集依赖
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }

  // 触发依赖
  notice() {
    this.effects.forEach(item => {item()})
  }
}

export const ref = (initState) => {
  let dep = new Dep(initState)
  return dep
}


const targetMap = new Map()
export const reactive = (initState) => {
  return new Proxy(initState, {
    get (target, key) {
      let dep = getDep(target, key)
      dep.depend()

      return Reflect.get(target,key)
    },
    set (target, key, value) {
      let depsMap = targetMap.get(target)
      let dep = depsMap.get(key)
      const result = Reflect.set(target, key, value)
      dep.notice()
      return result
    }
  })
}

const getDep = (target, key) => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

export const effectWatcher = (cb) => {
  currentEffect = cb
  cb()
  currentEffect = null
}
