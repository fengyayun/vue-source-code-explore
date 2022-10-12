<template>
  <div>
    <button @click="flag = !flag">切换组件</button>
    <KeepAlive>
      <A v-if="flag"></A>
      <B v-else></B>
    </KeepAlive>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import A from './views/A.vue'
  import B from './views/B.vue'
  let flag = ref<Boolean>(false)
</script>
<style scoped lang="less">
</style>