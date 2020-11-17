# emp-vue2-in-vue3

> Use the `Vue2` component on `Vue3` to seamlessly integrate `Vue3` `Vue2`👯

## 📦 Installation

## 👨‍💻Usage

### Use Vue2 components in Vue3

1. Create an empty element and define its id for mounting the `Vue2` component
2. Use `Vue2InVue3` to convert `Vue2` component to `Vue3`
3. Mount the component to `Vue3`

```vue
<template>
  <div>
    <h1>VUE 3 Project</h1>
    <!-- Create an empty element to mount the Vue2 component, and assign a value to the element’s id -->
    <div id="content"></div>
    <!-- Components from Vue 2 to Vue 3 -->
    <conent-in-vue3
      :dataProps="num"
      :methodProps="propsFunc"
      @myEvent="emitFunc"
    />
  </div>
</template>

<script>
// Vue2 components Content
import Content from "@v2b/Content";
// use Vue2InVue3
import Vue2InVue3 from "emp-vue2-in-vue3";
// Pass in Vue2 component and empty element id to Vue2InVue3
const ContentInVue3 = Vue2InVue3(Content, "content");

export default {
  name: "App",
  components: {
    // Mount the converted Vue2 component
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
};
</script>
```

### Precautions for using Vue2 components by Vue3:

`Vue2` Use the custom event passed by `Vue3` to change the function name `kebab-case` to `camelCase` and add the prefix `on`
For example: calling `@my-event` needs to be written as `onMyEvent`

The `Vue2` component used above:

```vue
<template>
  <div>
    <div class="v2box">{{ title }}</div>
    <button class="button" @click="add">Vue2 Add Button</button>
    <div class="v2box">Prop: {{ dataProps }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Vue2 Component",
    };
  },
  props: {
    dataProps: { type: Number, required: false },
    methodProps: { type: Function, required: false },
  },
  methods: {
    add() {
      // Vue2 uses the custom event passed by Vue3 to change the function name kebab-case to camelCase and add the prefix on
      // For example: calling @my-event needs to be written as onMyEvent
      this.$emit("onMyEvent");
    },
  },
  mounted: function () {
    this.methodProps && this.methodProps();
  },
};
</script>

<style>
.v2box {
  font-size: 38px;
  color: green;
  font-weight: bold;
}
.button {
  width: 200px;
  padding: 20px 0;
}
</style>
```
