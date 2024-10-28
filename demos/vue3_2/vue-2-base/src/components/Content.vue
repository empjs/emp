<template>
  <div>
    <!-- <button class="button bigSize" @click="increment">Vuex Store : {{ $store.state.count }}</button> -->
    <button @click="showMore">More... update from base</button>
    <div class="more">
      <ul v-if="isMore === true">
        <li>
          <!-- <button class="button" @click="increment">Vuex Store : {{ $store.state.count }}</button> -->
        </li>
        <li>
          <h2>{{ title }}</h2>
          <button class="button" @click="add">Vue2 Add Button</button>
        </li>
        <li>
          <h2>prop: {{ dataProps }}</h2>
          <Button text-val="button components in content from import" />
        </li>
      </ul>
    </div>
    <h2>JSX Dynamic Component</h2>
    <DynamicButton text-val="dynamic import" />
    <!-- <Hello /> -->
  </div>
</template>

<script>
import Button from './Button.vue'
export default {
  components: {
    Button,
    // Hello: () => import('./Hello'),
    DynamicButton: () => import('./Button'),
  },
  props: {
    dataProps: {type: Number, required: false},
    methodProps: {type: Function, required: false},
  },
  data() {
    return {
      isMore: false,
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
    showMore() {
      this.isMore = !this.isMore
    },
    increment() {
      // this.$store.commit('increment')
      // console.log(this.$store.state.count)
    },
    add() {
      console.log('click event')
      // Vue2 使用 Vue3 传过来的自定义事件需要把函数名 kebab-case 改为 camelCase 再加前缀 on
      // 例如：调用 @my-event 需要写成 onMyEvent
      this.$emit('onMyEvent')
    },
  },
}
</script>

<style lang="scss">
.button.bigSize {
  font-size: 30px;
  width: auto;
  padding: 3px 8px;
}
.more {
  ul,
  li {
    list-style: none;
    button {
      width: auto;
      padding: 3px 8px;
    }
  }
  h2 {
    font-size: 14px;
  }
}
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
