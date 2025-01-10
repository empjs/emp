<template>
    <div class="vue">
      <Nav/>
      <h1>Vue {{version}} <span>App.vue</span></h1>
    </div>
  </template>
  
  <script lang="ts">
  import {version} from 'vue'
  import Nav from './nav.vue'
  export default {
    name: 'App',
    components:{Nav},
    data(){
      return {
        version
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