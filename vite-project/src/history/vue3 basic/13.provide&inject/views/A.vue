<template>
  <div style="background-color: green;">
      我是A
      <div>{{ flag }}</div>
  </div>
</template>
  
<script setup lang='ts'>
import { inject, Ref, ref } from 'vue'

const flag = inject<Ref<number>>('flag', ref(1))

const change = () => {
  flag.value = 2
}
</script>
  
<style>
</style>