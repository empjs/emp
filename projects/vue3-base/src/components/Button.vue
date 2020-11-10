<template>
<div>
  <h2>Vue 3 Base Button Component count</h2>
  <p class="num">{{ count }}</p>
  <button class="button" @click="inc">INC</button>

</div>
</template>

<script>
export default {
  name: 'Button',
  setup() {},
  data() {
    return {
      count: 0,
    };
  },
  mounted() {
    this.count = parseInt(window.localStorage.getItem('count') || 0)
    console.log('before storage change')
    window.addEventListener('storage', (e) => {
      console.error('storage change', e)
      this.count = parseInt(window.localStorage.getItem('count') || 0)
    }, false);
  },
  methods: {
    inc() {

      window.localStorage.setItem('count', ++this.count)
    }
  },
};
</script>

<style>
.num {
  font-size: 90px;
  padding: 0;
  margin: 0;
  font-weight: bold;
}

.button {
  width: 200px;
  padding: 20px 0;
}
</style>
