<template>
  <div>
    <button @click="increase">count is: {{ count }}, state.count is {{ state.count }}</button>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
export default {
  setup() {
    let count = ref(0)
    let state = reactive({ count: 0 })
    const increase = () => {
      count.value++
      state.count++
    }
    return { count, state, increase }
  },
}
</script>
