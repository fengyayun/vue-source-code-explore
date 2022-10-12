<template>
  <div>
      <input step="20" v-model="num.current" type="number" />
      <div>{{ num.tweenedNumber.toFixed(0) }}</div>
  </div>
</template>
  
<script setup lang='ts'>
import { reactive, watch } from 'vue'
import gsap from 'gsap'
const num = reactive({
  tweenedNumber: 0,
  current:0
})

watch(()=>num.current, (newVal) => {
  gsap.to(num, {
      duration: 1,
      tweenedNumber: newVal
  })
})

</script>
  
<style>
</style>