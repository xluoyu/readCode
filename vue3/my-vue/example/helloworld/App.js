// import {ref, h, watchEffect, watch} from "../../node_modules/vue/dist/vue.esm-browser.js";
import { ref, h, watchEffect, watch} from "../../src/index"

const Child =  {
  setup() {
    const count = ref(0)

    watchEffect(() => {
      console.log('--------- watchEffect ----------')
      console.log(`count改变了 watchEffect`, count.value)
    })

    watch(count, (count, prevCount) => {
      console.log('--------- watch ----------')
      console.log(`count改变了 watch`, count)
      console.log(`之前的值是`, prevCount)
    })

    window.count = count
    return {
      count
    }
  },
  render(context) {
    console.log(context)
    return h('div', {class: 'child-item'}, `当前count: ${context.count.value}`)
  },
}

export default {
  setup() {
  },
  render(context) {
    return h('div', {id: 'page'}, [
      h('div', {}, '这是主组件'),
      // h('div', {class: 'child-item'}, `当前count: ${context.count.value}`)
      h(Child)
    ]) 
  }
}