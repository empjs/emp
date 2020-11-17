# emp-vue2-in-vue3

> 👀`Vue3` 上使用 `Vue2` 组件，无缝整合 `Vue3` `Vue2`👯

## 📦 安装

## 👨‍💻用法
### 在 Vue3 上使用 Vue2 的组件
1. 新建空标签且定义其 `id`，用于挂载 `Vue2` 组件
2. 使用 `Vue2InVue3` 转换 `Vue2` 组件到 `Vue3`
3. 挂载组件到 `Vue3`

```vue
<template>
  <div>
    <h1>VUE 3 Project</h1>
    <!-- 新建一个空标签用于挂载 Vue2 组件，同时给标签的 id 赋值 -->
    <div id="content"></div>
    <!-- Vue2 转到 Vue3 的组件 -->
    <conent-in-vue3
      :dataProps="num"
      :methodProps="propsFunc"
      @myEvent="emitFunc"
    />
  </div>
</template>

<script>
// Vue2的组件 Content
import Content from "@v2b/Content";
// 引入 Vue2InVue3
import Vue2InVue3 from "emp-vue2-in-vue3";
// 传入 Vue2 组件和空标签的 id 到 Vue2InVue3
const ContentInVue3 = Vue2InVue3(Content, "content");

export default {
  name: "App",
  components: {
    // 挂载转换好的 Vue2 组件
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

### Vue2 组件被 Vue3 使用注意事项：
`Vue2` 使用 `Vue3` 传过来的自定义事件需要把函数名 `kebab-case` 改为 `camelCase` 再加前缀 `on`
例如：调用 `@my-event` 需要写成 `onMyEvent`

上述使用的 `Vue2` 组件:
```vue
<template>
  <div>
    <div class="v2box">{{ title }}</div>
    <button class="button" @click="add">Vue2 Add Button</button>
    <div class="v2box" >Prop: {{ dataProps }}</div>
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
      // Vue2 使用 Vue3 传过来的自定义事件需要把函数名 kebab-case 改为 camelCase 再加前缀 on
      // 例如：调用 @my-event 需要写成 onMyEvent
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
