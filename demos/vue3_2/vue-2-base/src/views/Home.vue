<template>
  <div>
    <h1>SVGA COMPONENT LOGO:</h1>
    <!-- <Logo class="svg-logo" /> -->
    <h2>Hello JSX Component</h2>
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
    <h2>Content Component</h2>
    <Content />
    <!-- <h2>Element Table</h2>
    <Table /> -->
    <!-- <h2>CompositionApi</h2>
    <CompositionApi /> -->
  </div>
</template>
<script>
import CompositionApi from '../components/CompositionApi'
import Content from '../components/Content'
// import Logo from './logo.svg'
import Table from '../components/table'
export default {
  components: {
    Content,
    // Logo,
    Table,
    CompositionApi,
  },
}
</script>
<style scoped lang="scss">
$black: #000;

img {
  width: 200px;
  // background-color: $black;
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
