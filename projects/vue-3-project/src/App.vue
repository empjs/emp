<template>
  <div>
    <h1>Vue 3 Project</h1>
    <h2>vue3Base/TableComponent</h2>
    <TableComponent />
    <h2>vue3Base/JSXComponent</h2>
    <JSXComponent />
    <TsxScript
      attr1="aaa"
      :attr2="true"
    />
    <ButtonComponent
      attr1="bbb"
      :attr2="true"
    />
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
import TsxScript from '@vue3Base/TsxScript'
import ButtonComponent from '@vue3Base/ButtonComponent'
</script>

<style lang="less" scoped></style>
