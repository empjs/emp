<template>
  <div>
    <h2>hello vue Component Here! {{ name }}</h2>
    <button @click="handleButtonClick">click me</button>
  </div>
</template>

<script>
export default {
  name: 'HelloVue',
  props: {
    name: {
      type: String,
      default: 'appName',
    },
  },
  methods: {
    handleButtonClick(e) {
      // e.preventDefault()
      console.log('button clicked')
    },
  },
}
</script>

<style scoped>
h2 {
  color: #42b983;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa776;
}
</style>