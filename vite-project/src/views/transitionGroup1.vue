<template>
  <div>
    <button @click="Push">Push</button>
    <button @click="Pop">pop</button>
    <transition-group>
        <div style="margin: 10px;" :key="item" v-for="item in list">{{ item }}</div>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const list = reactive<number[]>([1, 2, 4, 5, 6, 7, 8, 9])
const Push = () => {
    list.push(123)
}
const Pop = () => {
    list.pop()
}
</script>
<style scoped lang="less">
</style>