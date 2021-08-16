// import {ref, h, watchEffect, watch} from "../../node_modules/vue/dist/vue.esm-browser.js";
import { ref, h, watchEffect, watch} from "../../src/index"

const Child =  {
  setup() {
    const count = ref(0)

    watchEffect(() => {
      console.log('--------- watchEffect ----------')
      console.log(`count改变了 watchEffect`, count.value)
    })

    const setCount = (newVal) => {
      console.log(newVal)
      count.value = newVal
    }
    window.count = count
    // watch(count, (count, prevCount) => {
    //   console.log('--------- watch ----------')
    //   console.log(`count改变了 watch`, count)
    //   console.log(`之前的值是`, prevCount)
    // })
    return {
      count,
      setCount
    }
  },
  render() {
    return h('div', {class: 'child-item'}, [
      h('button', {
        onClick: () => {
          console.log('执行了')
          this.setCount(this.count.value + 1)
        }
      }, '这是副标题'),
        h('p', {}, `当前count: ${this.count.value}`)
      ])
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