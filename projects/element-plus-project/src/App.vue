<template>
  <div>
    <h1>VUE 3 Element Project！</h1>
    <v3p-helloworld msg="远程调用 Element-plus Base 组件"/>
  </div>
</template>

<script>
import HelloWorld from '@v3p/HelloWorld'
export default {
  components:{
    'v3p-helloworld': HelloWorld
  },
  setup() {},
  mounted() {},
  name: "App",
};
</script>
