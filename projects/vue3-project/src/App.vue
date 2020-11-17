<template>
  <div>
    <h1>VUE 3 Project</h1>
    <v3b-button />
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
import Vue from "../../../node_modules/vue";
import Content from "@v2b/Content";
import Vue2InVue3 from "../../../packages/emp-converter/vue2-in-vue3";
const ContentInVue3 = Vue2InVue3(Content, "content");

export default {
  components: {
    "conent-in-vue3": ContentInVue3,
  },
  data() {
    return {
      component: Content,
      num: 0,
    };
  },
  methods: {
    propsFunc() {
      console.log("Vue3 to Vue2 Method Props");
    },
    emitFunc() {
      this.num++;
    },
  },
  setup() {},
  mounted() {},
  name: "App",
};
</script>
