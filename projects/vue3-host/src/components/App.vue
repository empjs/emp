<template>
  <div class="header">
    <img class="logo item" :src="logo">
    <div class="info item">
      <h1>Vue {{ vueVersion }}</h1>
      <div class="desc">
        <p>vue-router:{{ vueRouterVersion }} / pinia:{{ piniaVersion }}</p>
      </div>
    </div>

  </div>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/">Go to home</RouterLink> |
    <RouterLink to="/info">Go to info</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
// import { useCounterStore } from './countStore'

// const counterStore = useCounterStore()
import logo from 'src/assets/logo.svg'
import { ref } from 'vue'

const vueVersion = ref(import.meta.env.vueVersion)
const vueRouterVersion = ref(import.meta.env.vueRouterVersion)
const piniaVersion = ref(import.meta.env.piniaVersion)
</script>

<style scoped lang="scss">
p,
h1 {
  margin: 0;
  padding: 0;
}

.logo {
  width: 80px;
}

.header {
  display: flex;
  padding: 20px 0;


}

.info {
  margin-left: 20px;

  .desc {
    font-size: 12px;
  }
}
</style>