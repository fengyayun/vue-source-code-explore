<template>
  <div>
    <button @click="flag = !flag">切换</button>
    <transition
      leave-active-class="animate__animated animate__fadeIn"
      enter-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="flag" class="box"></div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
let flag = ref<Boolean>(false)
</script>
<style scoped lang="less">
.box {
  width: 200px;
  height: 200px;
  background: red;
}
</style>
