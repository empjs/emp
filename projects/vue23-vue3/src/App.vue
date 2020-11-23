<template>
  <div>
    <h1>VUE 3 Project</h1>
    <v3b-button />
    <!-- 为了保持加载顺序需要挂载一个空的 dom ，将 id 传给 emp-vuett-->
    <div id="content"></div>
    <conent-in-vue3
      :dataProps="num"
      :methodProps="propsFunc"
      @myEvent="emitFunc"
    />
    <v3b-content />
  </div>
</template>

<script>
import { defineAsyncComponent, render } from "vue";
// Vue2 组件
import Content from "@v2b/Content";
// Vue2 在 Vue3 运行的 HOC
import { Vue2InVue3 } from "@efox/emp-vuett";
// 让 Vue2 组件通过 emp-vuett 可以在 Vue3 上运行
// 传入 Vue2 组件和当前模板一个空div的id
const ContentInVue3 = Vue2InVue3(Content, "content");

export default {
  components: {
    "conent-in-vue3": ContentInVue3,
  },
  data() {
    return {
      num: 0,
    };
  },
  methods: {
    // 正常传递 props 到 Vue2 组件
    propsFunc() {
      console.log("Vue3 to Vue2 Method Props");
    },
    // 可以正常在 Vue2 组件上使用 emit
    emitFunc() {
      this.num++;
    },
  },
  setup() {},
  mounted() {},
  name: "App",
};
</script>
