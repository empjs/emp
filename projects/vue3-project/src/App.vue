<template>
<div>
  <h3>Main App</h3>
  <Content />
  <Button @click="inc" text="增加" />
  <Button @click="dec" text="减少" />
  <p>COUNT:{{count}}</p>
</div>
</template>

<script>
import {
  ref,
  defineAsyncComponent
} from "vue";
// import Content from "./components/Content";
// import Button from "./components/Button";
export default {
  components: {
    Content: defineAsyncComponent(() => import("./components/Content")),
    Button: defineAsyncComponent(() => import("./components/Button")),
  },
  // components: {
  //   Content,
  //   Button,
  // },
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };
    const dec = () => {
      count.value--;
    };
    return {
      count,
      inc,
      dec
    };
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
