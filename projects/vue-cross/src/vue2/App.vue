<template>
    <div class="vue">
        <div class="nav">
    <a :href="getUrl('2003')">Vue 3</a>
    <a :href="getUrl('2002')">Vue 2</a>
  </div>
      <h1>Vue {{version}} <span>App.vue</span></h1>
    </div>
  </template>
<script>
import Vue from 'vue'
import {getUrl} from '../config'
export default {
    data(){
        return {
            getUrl,
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
    .nav{
    a{
        display: inline-block;
        margin-right: 10px;
    }
}
}
</style>