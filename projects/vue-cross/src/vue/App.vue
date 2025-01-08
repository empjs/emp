<template>
    <div class="vue">
      <h1>Vue {{version}} <span>App.vue</span></h1>
    </div>
  </template>
<script>
import Vue from 'vue'

export default {
    data(){
        return {
            version:Vue.version
        }
    }
}
</script>
<style lang="scss" scoped>
.vue{
    h1{
        color:#222;
        span{
            font-size: 12px;
            font-weight: normal;
        }
    }
}
</style>