<template>
  <div>
    <h1>Vue 3 Project</h1>
    <h2>=== @v2b/Content ===</h2>
    <Content />
    <h2>CompositionApi</h2>
    <CompositionApi />
    <h2>=== @v2b/Table ===</h2>
    <Table />
  </div>
</template>


<script>
//import Content from "@v2b/Content"
export default {
  components: {
    Content: () => import('@v2b/Content'),
    Table: () => import('@v2b/Table'),
    CompositionApi: () => import('@v2b/CompositionApi'),
  },
}
</script>

<style lang="less" scoped></style>
