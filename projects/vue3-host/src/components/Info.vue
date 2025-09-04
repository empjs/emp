<template>
    <h1>Vue3 Info</h1>
    <h2>info component</h2>
    <Count :count="count" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Count from './Count.vue'
const count = ref(99)
</script>