<template>
<div>
  <h1>VUE 3 Base</h1>
  <ul>
    <li>
      <Content />
    </li>
    <li><Button /></li>
  </ul>
</div>
</template>

<script>
import {
  defineAsyncComponent
} from 'vue'
export default {
  setup() {},
  components: {
    Content: defineAsyncComponent(() => import("./components/Content")),
    Button: defineAsyncComponent(() => import("./components/Button")),
  },
}
</script>
