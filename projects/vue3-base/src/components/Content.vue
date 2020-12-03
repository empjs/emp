<template>
<div>
  <h2>{{ title }}</h2>
  <p>=== Button Components begin: ===</p>
  <emp-button />
    <p>=== Button Components end: ===</p>
</div>
</template>

<script>
import {  defineAsyncComponent } from 'vue'
//import Button from './Button'
export default {
  name: 'Content',
  components: {
    'emp-button':defineAsyncComponent(() =>
      import('./Button.vue')
    ),
  },
  setup() {},
  data() {
    return {
      title: "Vue 3 BASE Component Content",
    };
  },
};
</script>
