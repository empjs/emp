<template>
  <div>
    <div @click="countData++">{{countData}}</div>
    <h1>Vue 3 Project</h1>
    <h2>vue2 Component: === @v2b/Content ===</h2>
    <Vue2InVue3Adapter :mfComponent="() => import('@v2b/Content')" />  
    <h2>vue2 Component: === @v2b/Home ===</h2>
    <Vue2InVue3Adapter :mfComponent="() => import('@v2b/Home')" />  
  </div>
</template>

<script>
import { vueAdapter } from '@empjs/share/adapter'
import vue, { ref } from 'vue'
const {Vue2InVue3Adapter} = vueAdapter
export default {
  components: {
    Vue2InVue3Adapter,
  },
  setup() {
    const countData = ref(0);
    return {
      countData
    }
  }
}
</script>

<style lang="less" scoped></style>
