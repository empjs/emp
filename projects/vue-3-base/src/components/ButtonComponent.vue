<template>
  <div>
    <AButton type="primary" @click="add">add</AButton>
    <span class="value">value: {{ value }}</span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ButtonComponent',
}
</script>

<script lang="ts" setup>
import {ref} from 'vue'

const value = ref(0)

function add() {
  value.value++
}
</script>

<style lang="less" scoped>
.value {
  margin-left: 10px;
}
</style>
