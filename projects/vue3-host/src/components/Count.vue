<template>
    <h3>count {{ name }}: <b>{{ count }}</b></h3>
    <button class="button" v-on:click="counterStore.increment">Clicked Me</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from './countStore'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)
const { name } = defineProps({
    name: {
        type: String,
        default: 'count',
    },
})
</script>

<style lang="css" scoped>
h3 b {
    font-size: 36px;
}

.button {
    background-color: #04AA6D;
    /* Green */
    border: none;
    color: white;
    padding: 8px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    border-radius: 8px;
}
</style>
