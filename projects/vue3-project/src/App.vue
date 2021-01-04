<template>
  <div>
    <h1>VUE 3 Project！</h1>
    <v3b-button />
    <v3b-content />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    "v3b-content": defineAsyncComponent(() => import("@v3b/Content")),
    "v3b-button": defineAsyncComponent(() => import("@v3b/Button")),
  },
  setup() {},
  mounted() {},
  name: "App",
};
</script>
