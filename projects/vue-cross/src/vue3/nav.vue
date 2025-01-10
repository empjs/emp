
<script setup>
import {getUrl} from '../config'

</script>

<template>
  <div class="nav">
    <a :href="getUrl('2003')">Vue 3</a>
    <a :href="getUrl('2002')">Vue 2</a>
  </div>
</template>

<style lang="scss" scoped>
.nav{
    a{
        display: inline-block;
        margin-right: 10px;
    }
}
</style>