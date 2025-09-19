<template>
    <h1>Vue3 Sub Component</h1>
    <p>props name: {{ name }}</p>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        }
    }
}
</script>
