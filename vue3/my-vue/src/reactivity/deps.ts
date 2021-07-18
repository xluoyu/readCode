import {getCurrent} from './index'

export class Deps {
  private _val: any
  effects: Set<Function>
  constructor (val: any) {
    this._val = val
    this.effects = new Set()
  }
  get value () {
    this.depend()
    return this._val
  }
  set value (newVal) {
    this._val = newVal
    this.notice()
  }
  // 搜集依赖
  depend () {
    let currentHook = getCurrent()
    if (currentHook) {
      this.effects.add(currentHook)
    }
  }
  
  // 触发更新
  notice() {
    this.effects.forEach((item) => {
      item()
    })
  }
}