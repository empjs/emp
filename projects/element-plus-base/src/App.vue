<template>
  <div>
    <img class="logo" alt="Vue logo" src="./logo.png" />
    <hello-world :msg="msg" />
  </div>
</template>

<script>
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "App",
  components: {
    HelloWorld,
  },
  setup() {
    const msg = ref(
      "Welcome to Element Plus, a Vue 3.0 based component library"
    );
    const startHacking = () => {
      msg.value = "Start coding with Element Plus with 💖";
    };
    return {
      msg,
      startHacking,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  width: 10%;
}
.btn {
  margin-top: 100px;
}
</style>