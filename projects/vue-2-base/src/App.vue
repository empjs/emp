<template>
  <div>
    <h1>Vue 2 Base</h1>
    <logo style="width: 100px" />
    <img :src="require('./logo.png')" alt="logo" />
    <Content />
    <Table />
  </div>
</template>

<script>
import Content from './components/Content'
import logo from "./logo.svg";
import Table from "./components/table.vue"
export default {
  components: {
    Content,
    logo,
    Table,
  },
};
</script>

<style scoped>
img {
  width: 200px;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
