<template>
  <div class="main">
    <h1>Project App ! vue 2 project</h1>
    <h2>Content</h2>
    <Content />
    <h2>CompositionApi</h2>
    <!-- <CompositionApi /> -->
  </div>
</template>

<script>
//import Content from "@v2b/Content"
export default {
  components: {
    Content: () => import('@v2b/Content'),
    // CompositionApi: () => import('@v2b/CompositionApi'),
  },
}
</script>

<style scoped lang="scss">
.main {
  img {
    width: 200px;
  }

  h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 60px;
  }
}
</style>
