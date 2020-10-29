<template>
<div class="layout-app">

  <h1>
    EMP vue3 Base 业务主站
  </h1>
  <img src="./logo.png" width="30" />
  <h1>EMP vue3 Components 调用远程组件</h1>
  <div class="remote-component">
    <ul>
      <li>
        <h2>远程元素 Content.vue</h2>
        <content-element />
      </li>
      <li>
        <h2>远程元素 Button.js</h2>
        <button-element @click="inc" text="+" />
        <button-element @click="dec" text="-" />
        <p>remote component local ref Count : <b>{{count}}</b></p>
      </li>
      <li>
        <h2>组件基站</h2>
        <a :href="config.baseRemote">点击跳转</a>
      </li>
    </ul>
    <p>config require : {{config}}</p>
  </div>
</div>
</template>

<script>
import {
  ref
} from 'vue'
const {
  config
} = require('./config')
export default {
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };
    const dec = () => {
      count.value--;
    };
    return {
      count,
      inc,
      dec,
    };
  },
  data() {
    return {
      config
    }
  }
};
</script>

<style scoped>
img {
  width: 200px;
}

h1 {
  font-family: Arial, Helvetica, sans-serif;
}

.remote-component {
  border: 1px solid blue;
  padding: 10px;
}

.layout-app {
  border: 1px solid green;
  padding: 10px;
}

.app-label {
  padding: 5px 2px;
  font-style: italic;
  font-size: 20px;
  color: gray;
}
</style>
