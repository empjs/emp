<template>
	<div>
		<h1>Vue3 Home</h1>
		<p>vue3 home component</p>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'App',
	}
</script>

<script lang="ts" setup>
	//
	import {onBeforeMount, onMounted, onUnmounted} from 'vue'

	onMounted(() => console.log('onMounted'))
	onUnmounted(() => console.log('onUnmounted'))
	onBeforeMount(() => console.log('onBeforeMount'))
</script>

<style lang="less" scoped></style>
