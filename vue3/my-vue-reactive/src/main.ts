import { ref } from '../core/ref'

const add = ref(123)

console.log(add.value)

add.value = 845