<template>
  <div>
    <h1>Vue 3 Project</h1>
    <h2>vue3Base/TableComponent</h2>
    <TableComponent />
    <h2>vue3Base/JSXComponent</h2>
    <JSXComponent />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<script lang="ts" setup>
import TableComponent from '@vue3Base/TableComponent'
import JSXComponent from '@vue3Base/JSXComponent'
</script>

<style lang="less" scoped></style>
