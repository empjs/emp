<template>
  <div>
    <div class="v2box">{{ title }}</div>
    <button class="button" @click="add">Vue2 Add Button</button>
    <div class="v2box">Prop: {{ dataProps }}</div>
    <p>============ button component start =============</p>
    <Button text-val="button components in content from import" />
    <DynamicButton text-val="dynamic import" />
    <p>============ button component end =============</p>
  </div>
</template>

<script>
import Button from './Button.vue'
export default {
  components: {
    Button,
    DynamicButton: () => import('./Button.vue'),
  },
  props: {
    dataProps: {type: Number, required: false},
    methodProps: {type: Function, required: false},
  },
  data() {
    return {
      title: 'EMP Vue2 Component From BASE!',
    }
  },
  mounted() {
    this.methodProps && this.methodProps()
    // console.log(this.$props)
    // console.log(this.$attrs)
    // console.log(this.$listeners)
  },
  methods: {
    add() {
      console.log('click event')
      // Vue2 使用 Vue3 传过来的自定义事件需要把函数名 kebab-case 改为 camelCase 再加前缀 on
      // 例如：调用 @my-event 需要写成 onMyEvent
      this.$emit('onMyEvent')
    },
  },
}
</script>

<style>
.v2box {
  font-size: 38px;
  color: green;
  font-weight: bold;
}
.button {
  width: 200px;
  padding: 20px 0;
}
</style>
