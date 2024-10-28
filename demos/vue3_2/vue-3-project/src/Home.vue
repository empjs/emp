<template>
  <div>
    <h1>Vue 3 Project</h1>
    <h2>=== @v2b/Content ===</h2>
    <Vue2InVue3Adapter :mfComponent="() => import('@v2b/Content')" />  
    <h2>=== @v2b/compositionApi ===</h2>
    <Vue2InVue3Adapter :mfComponent="() => import('@v2b/CompositionApi')" />  
    
    <div @click="countData++">{{countData}}</div>
  </div>
</template>

<script>
import {ref} from 'vue'
import Vue2InVue3Adapter, {vue2ToVue3} from './util'
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
