<template>
	<div>
		<h1>Vue 3 Project</h1>
		<h2>vue3Base/TableComponent</h2>
		<TableComponent/>
		<h2>vue3Base/JSXComponent</h2>
		<JSXComponent/>
		<TsxScript attr1="aaa" :attr2="true"/>
		<ButtonComponent attr1="bbb" :attr2="true"/>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'App',
	}
</script>

<script lang="ts" setup>
	import ButtonComponent from '@v3/ButtonComponent'
	import JSXComponent from '@v3/JSXComponent'
	import TableComponent from '@v3/TableComponent'
	import TsxScript from '@v3/TsxScript'
	//
	import {onBeforeMount, onMounted, onUnmounted} from 'vue'

	onMounted(() => console.log('onMounted'))
	onUnmounted(() => console.log('onUnmounted'))
	onBeforeMount(() => console.log('onBeforeMount'))
</script>

<style lang="less" scoped></style>
