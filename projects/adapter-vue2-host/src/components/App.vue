<template>
  <div class="header">
    <img class="logo item" :src="logo">
    <div class="info item">
      <h1>Vue {{ vueVersion }}</h1>
      <div class="desc">
        <p>vue-router:{{ vueRouterVersion }} / vuex:{{ vuexVersion }}</p>
      </div>
    </div>
  </div>
  <nav>
    <router-link to="/">Go to home</router-link> /
    <router-link to="/info">Go to info</router-link>
  </nav>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
import logo from '@/assets/logo.png'

export default {
  data() {
    return {
      logo,
      vueVersion: process.env.vueVersion,
      vueRouterVersion: process.env.vueRouterVersion,
      vuexVersion: process.env.vuexVersion
    }
  }
}
</script>

<style scoped>
p,
h1 {
  margin: 0;
  padding: 0;
}

.logo {
  height: 60px;
}

.header {
  display: flex;
  padding: 20px 0;
}

.info {
  margin-left: 20px;
}

.info .desc {
  font-size: 12px;
}
</style>