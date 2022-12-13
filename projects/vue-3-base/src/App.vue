<template>
  <div>
    <h1>Vue 3 Base</h1>
    <span>svg component:</span>
    <Logo style="width: 100px" />
    <span>svg image:</span>
    <div
      :style="{
        display: 'inline-block',
        width: '100px',
        height: '100px',
        background: `url(${LogoImage}) no-repeat`,
      }"
    ></div>
    <TableComponent />
    <ButtonComponent />
    <JSXComponent />
    <Count />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<script lang="ts" setup>
import Logo from './logo.svg?component'
import LogoImage from './logo.svg'
import TableComponent from './components/TableComponent.vue'
import ButtonComponent from './components/ButtonComponent.vue'
import JSXComponent from './components/JSXComponent'
import Count from './components/Count.vue'
</script>

<style lang="less">
body {
  padding: 10px;
}
</style>
