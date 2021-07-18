// const {ref, effect} = require('@vue/reactivity')
// const {ref, effect} = require('./core/reactivity')
import {ref, effectWatcher, reactive} from './core/reactivity/index.js'

let a = ref(1)
let b;
const obj = reactive({
  name: 'kkk',
  age: 10
})


effectWatcher(() => {
  b = a.value + 10
  console.log(b)
})

a.value = 20

effectWatcher(() => {
  console.log('reactive132')
  console.log(obj.age)
})

obj.age = 25