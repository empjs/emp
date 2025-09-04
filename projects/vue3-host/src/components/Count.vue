<template>
    <h3>count: {{ count }}</h3>
    <button v-on:click="count++">You clicked me {{ count }} times.</button>
</template>

<script setup>
import { ref } from 'vue'



const props = defineProps({
    count: {
        type: Number,
        default: 0
    }
})
const count = ref(props.count)
</script>