import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function increment() {
    count.value++
  }

  return {count, increment}
})
