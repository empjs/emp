<template>
  <div>
    <Content title="I am Vue Project" />
    <hello-react title="Remote React Component" />
  </div>
</template>

<script>

import { ReactInVue } from "vuera";
import Content from "./components/Content";

import Vue from "vue";
const HelloReact = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('ReactComponents/components/Hello').then(res=>{
    return ReactInVue(res.default)
  }),
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 0,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})

export default {
  name: "APP",
  components: {
    Content,
    "hello-react":HelloReact
  },
  data() {
    return {};
  },
  created() {
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
