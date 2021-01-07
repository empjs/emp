<template>
  <div>
    <h1>VUE 3 Typescript!</h1>
    <ul>
      <li>
        <Content />
      </li>
      <li><Button /></li>
      <li>
      <h2>ButtonTsx</h2>
      <ButtonTsx />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import ButtonTsx from 'src/components/ButtonTsx'
export default {
  setup() {},
  components: {
    Content: defineAsyncComponent(() => import("src/components/Content.vue")),
    Button: defineAsyncComponent(() => import("src/components/Button.vue")),
    ButtonTsx
  },
};
</script>

<style lang="less">
h1{
  color: @primary-color;
}
</style>