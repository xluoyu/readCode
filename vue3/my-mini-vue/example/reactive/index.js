import {ref, effect, reactive} from '@/reactivity/index'

const a = ref(123)

effect(() => {
  console.log(a.value)
})

a.value = 741


const obj = reactive({
  name: '小明',
  age: 15
})

console.log(obj)