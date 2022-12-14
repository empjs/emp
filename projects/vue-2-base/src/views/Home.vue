<template>
  <div>
    <h1>SVGA COMPONENT LOGO:</h1>
    <Logo style="width: 100px" />
    <h2>JSX</h2>
    <Hello />
    <h2>Img SRC:</h2>
    <img :src="require('./logo.png')" alt="logo" />
    <img :src="require('./logo.svg')" alt="logo" />
    <Content />
    <Table />
    <CompositionApi />
  </div>
</template>
<script>
import Content from '../components/Content.vue'
import Logo from './logo.svg'
import Table from '../components/table.vue'
import CompositionApi from '../components/CompositionApi.vue'
import Hello from '../components/Hello'
export default {
  components: {
    Content,
    Logo,
    Table,
    CompositionApi,
    Hello,
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
