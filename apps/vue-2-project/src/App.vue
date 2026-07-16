<template>
  <div class="main">
    <h1>Project App vue 2 project</h1>
    <h2>=== @v2b/Content ===</h2>
    <Content />
    <h2>CompositionApi</h2>
    <CompositionApi />
    <h2>=== @v2b/Table ===</h2>
    <Table />
    <h2>Vue3 in Vue2 capability</h2>
    <button @click="updateVue3Props">Update Vue3 props</button>
    <button @click="showVue3 = !showVue3">Toggle Vue3 remote</button>
    <Vue3Remote v-if="showVue3" :label="vue3Label" />
  </div>
</template>

<script>
import Vue3Remote from './Vue3Remote'

export default {
  components: {
    Content: () => import('@v2b/Content'),
    Table: () => import('@v2b/Table'),
    CompositionApi: () => import('@v2b/CompositionApi'),
    Vue3Remote,
  },
  data() {
    return {
      showVue3: true,
      vue3Label: 'from-vue2-initial',
    }
  },
  methods: {
    updateVue3Props() {
      this.vue3Label = 'from-vue2-updated'
    },
  },
}
</script>

<style scoped lang="scss">
.main {
  img {
    width: 200px;
  }

  h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 60px;
  }
}
</style>
