<template>
  <div>
    <h1>VUE 3 Project</h1>
    <v3b-content />
    <v3b-button />
    <v2b-content />
    <div id="vue2"></div>
  </div>
</template>

<script>
import { defineAsyncComponent, render } from "vue";
import Vue from "../../../node_modules/vue";

const HelloVue2 = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import("@v2b/Content").then((res) => {
    console.log(res.default);
    const modifyRender = `${res.default.render.toString()}`;
    console.log(modifyRender);
    return new Vue({
      render: (h) => {
        const element = h(res.default, {
          props: {
            dataProps: "Vue3 to Vue2 Props",
            methodProps: () => {
              console.log('Vue3 to Vue2 Method Props');
            },
          },
        });
        console.log(element);
        return element;
      },
    }).$mount("#vue2");
  }),
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 0,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000,
});

export default {
  components: {
    "v2b-content": HelloVue2,
  },
  setup() {},
  name: "App",
};
</script>
