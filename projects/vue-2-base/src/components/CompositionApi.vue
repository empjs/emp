<template>
  <div>
    <h2>=======composition-api for Vue2=======</h2>
    <button @click="increase">count is: {{ count }}, state.count is {{ state.count }}</button>
  </div>
</template>

<script>
import {ref, reactive} from '@vue/composition-api'
export default {
  setup() {
    let count = ref(0) // { value: 0 }
    let state = reactive({number: 0})
    const increase = () => {
      count.value++
      state.count++
    }
    return {count, state, increase}
  },
}
</script>
