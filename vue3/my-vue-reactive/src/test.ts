import { ref, toRaw } from '@vue/reactivity'

const a = ref(123)

console.log(toRaw(a))