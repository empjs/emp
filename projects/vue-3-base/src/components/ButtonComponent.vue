<template>
  <div>
    <AButton type="primary" @click="add">add</AButton>
    <span class="value">value: {{ value }}</span>
    <p>
      {{JSON.stringify(props)}}
    </p>
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
const props = defineProps({
  attr1: String,
  attr2: Boolean
})
</script>

<style lang="less" scoped>
.value {
  margin-left: 10px;
}
</style>
