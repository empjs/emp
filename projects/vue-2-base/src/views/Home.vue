<template>
  <div>
    <h1>SVGA COMPONENT LOGO:</h1>
    <Logo class="svg-logo" />
    <h2>JSX</h2>
    <Hello />
    <h2>Img Example in src</h2>
    <ul class="imgbox">
      <li>
        <h2>PNG</h2>
        <img class="svg-logo" :src="require('./logo.png')" alt="logo" />
      </li>
      <li>
        <h2>SVG</h2>
        <img class="svg-logo" svg-inline src="./logo.svg" alt="logo" />
      </li>
    </ul>
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
.imgbox {
  display: flex;
}
.imgbox h2 {
  text-align: center;
}
.imgbox li {
  flex: 1;
  list-style: none;
  text-align: center;
}
.svg-logo {
  width: 200px;
  margin: auto;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
