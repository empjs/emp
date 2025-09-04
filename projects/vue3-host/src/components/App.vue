<template>
  <h1>Hello App Count: {{ counterStore.count }}</h1>
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
import { useCounterStore } from './countStore'
const counterStore = useCounterStore()
</script>