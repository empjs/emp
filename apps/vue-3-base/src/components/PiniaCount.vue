<template>
	<section class="pinia-count">
		<h3>
			Pinia count {{ name }}: <b>{{ count }}</b>
		</h3>
		<button class="button" v-on:click="counterStore.increment">Increment Pinia Count</button>
	</section>
</template>

<script setup lang="ts">
	import {storeToRefs} from 'pinia'
	import {usePiniaCounterStore} from './piniaCounterStore'

	const counterStore = usePiniaCounterStore()
	const {count} = storeToRefs(counterStore)
	const {name} = defineProps({
		name: {
			type: String,
			default: 'count',
		},
	})
</script>

<style lang="css" scoped>
	.pinia-count {
		margin: 12px 0;
	}

	h3 b {
		font-size: 32px;
	}

	.button {
		background-color: #04aa6d;
		border: none;
		border-radius: 8px;
		color: white;
		display: inline-block;
		font-size: 14px;
		padding: 8px 20px;
		text-align: center;
	}
</style>
