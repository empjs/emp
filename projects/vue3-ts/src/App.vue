<template>
<div>
  <h1>VUE 3 Typescript!</h1>
  <ul>
    <li>
      <Content />
    </li>
    <li><Button /></li>
  </ul>
</div>
</template>

<script lang="ts">
import {
  defineAsyncComponent
} from 'vue'
export default {
  setup() {},
  components: {
    Content: defineAsyncComponent(() => import("src/components/Content.vue")),
    Button: defineAsyncComponent(() => import("src/components/Button.vue")),
  },
}
</script>
