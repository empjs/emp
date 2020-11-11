<template>
<div>
  <h1>VUE 3 Project</h1>
  <v3b-content />
  <v3b-button />
  <v2b-content />
</div>
</template>

<script>
import Content from "@v2b/Content"
export default {
  components: {
    'v2b-content': Content,
  },
  setup() {},
  name: 'App'
}
</script>
