<template>
  <div>
    <button @click="showTips">
      {{ textVal || 'vue2 base button' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    textVal: String,
  },
  methods: {
    showTips() {
      console.log(this.textVal)
    },
  },
}
</script>
