<script lang="ts">
import {defineComponent} from 'vue'
import {Table} from 'ant-design-vue'
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]
export default defineComponent({
  data() {
    return {
      count: 1,
      dataSource,
      columns,
    }
  },
})
</script>

<template>
  <div>
    {{ count.toFixed(2) }}

    <a-table :data-source="dataSource" :columns="columns" />

    <pre>{{ JSON.stringify(dataSource, null, 2) }}</pre>
  </div>
</template>
