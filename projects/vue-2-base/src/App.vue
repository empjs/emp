<template>
  <div>
    <h1>Vue 2 Base</h1>
    <Logo style="width: 100px" />
    <img :src="require('./logo.png')" alt="logo" />
    <Content />
    <Table />
    <CompositionApi />
  </div>
</template>

<script>
import Content from './components/Content'
import Logo from './logo.svg'
import Table from './components/table.vue'
import CompositionApi from './components/CompositionApi.vue'
export default {
  components: {
    Content,
    Logo,
    Table,
    CompositionApi,
  },
}
</script>

<style scoped>
img {
  width: 200px;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
