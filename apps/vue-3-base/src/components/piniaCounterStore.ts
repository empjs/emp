import {defineStore} from 'pinia'
import {ref} from 'vue'

export const usePiniaCounterStore = defineStore('emp-vue3-counter', () => {
  const count = ref(0)

  function increment() {
    count.value += 1
  }

  return {count, increment}
})
