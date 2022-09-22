<template>
  <div>
    <A v-show="flag"></A>
    <button @click="flag = !flag">切换flag</button>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, watchEffect} from 'vue'
import A from './views/A.vue';
const flag = ref<Boolean>(true)

</script>

<style scoped></style>
