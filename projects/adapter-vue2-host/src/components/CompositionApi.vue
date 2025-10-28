<template>
	<div>
		<button @click="increase">count is: {{ count }}, state.count is {{ state.count }}</button>
	</div>
</template>

<script>
	import {reactive, ref} from 'vue'
	export default {
		setup() {
			const count = ref(0)
			const state = reactive({count: 0})
			const increase = () => {
				count.value++
				state.count++
			}
			return {count, state, increase}
		},
	}
</script>
