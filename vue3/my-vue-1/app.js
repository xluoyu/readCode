import { h } from "./core/h.js"
import { ref, reactive, effectWatcher } from "./core/reactivity/index.js"

export default {
  setup() {
    const state = reactive({
      count: 0
    })
    window.state = state
    return {
      state
    }
  },
  render(context) {
    return h('div', {class: 'root'+context.state.count}, [h('p', null, String(context.state.count)), h('p', null, '789465')])
  }
}