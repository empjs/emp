<template>
    <h1>Vue3 Info</h1>
    <h2>info component</h2>
    <p>props name: {{ name }}</p>
    <!-- <Count name="inc" /> -->
    <SubComp name="subcomp" />
</template>

<script setup lang="ts">
// import Count from './Count.vue'

import SubComp from './SubComp.vue'

const { name } = defineProps({
    name: {
        type: String,
        default: 'info',
    },
})
</script>