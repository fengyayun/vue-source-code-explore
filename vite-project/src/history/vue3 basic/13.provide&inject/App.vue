<template>
  <div class="App">
      <button @click="change">change falg</button>
      <A></A>
  </div>
</template>
  
<script setup lang='ts'>
import { provide, ref } from 'vue'
import A from './views/A.vue'
let flag = ref<number>(1)
provide('flag', flag)
const change = () => {
  flag.value = 2
}
</script>
<style>
.App {
  background: blue;
  color: #fff;
}
</style>