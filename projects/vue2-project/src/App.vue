<template>
<div>
  <h3>Main App</h3>
  <Content />
</div>
</template>

<script>
//import Content from "@v2b/Content"
export default {
  components: {
    Content:()=>import("@v2b/Content"),
  },
};
</script>

<style scoped>
img {
  width: 200px;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
