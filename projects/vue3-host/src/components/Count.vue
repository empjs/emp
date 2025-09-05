<template>
    <h3>count: {{ count }}</h3>
    <button v-on:click="counterStore.increment">You clicked me {{ count }} times.</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from './countStore'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
</script>