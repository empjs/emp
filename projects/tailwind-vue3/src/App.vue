<template>
  <div class="content">
    <img alt="Vue logo" :src="LogoImage" class="logo" />
    <h1 class="text-3xl font-bold underline">Hello Emp & Tailwind CSS!</h1>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<script lang="ts" setup>
import LogoImage from './logo.svg'
</script>

<style lang="less">
.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  min-width: 100vw;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.logo {
  width: 100px;
  height: 100px;
}
</style>
