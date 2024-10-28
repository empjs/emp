<template>
  <div>
    <h1>Vue 3 Project</h1>
    <h2>=== @v2b/Content ===</h2>
    <div id="vue2Content"></div>
    <vue2-content />
    <h2>CompositionApi</h2>
    <!-- <CompositionApi /> -->
    <h2>=== @v2b/Table ===</h2>
    <!-- <Table /> -->
  </div>
</template>

<script>
import Content from "@v2b/Content"
import {vue2ToVue3} from './util'
export default {
  components: {
    vue2Content: vue2ToVue3(Content, 'vue2Content')
    // Content: defineAsyncComponent(() => import('@v2b/Content')),
    // Table: defineAsyncComponent(() => import('@v2b/Table')),
    // CompositionApi: defineAsyncComponent(() => import('@v2b/CompositionApi')),
  },
}
</script>

<style lang="less" scoped></style>
