<template>
  <div>
    <button @click="flag = !flag">切换</button>
    <transition :duration="{ enter: 500, leave: 800 }" name="fade">
      <div v-if="flag" class="box"></div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
let flag = ref<Boolean>(true)
</script>
<style scoped lang="less">
.box {
  width: 200px;
  height: 200px;
  background: red;
}
//开始过度
.fade-enter-from {
  background: red;
  width: 0px;
  height: 0px;
  transform: rotate(360deg);
}

//开始过度了
.fade-enter-active {
  transition: all 10s liner;
}

//过度完成
.fade-enter-to {
  background: yellow;
  width: 200px;
  height: 200px;
}

//离开的过度
.fade-leave-from {
  width: 200px;
  height: 200px;
  transform: rotate(360deg)
}

//离开中过度
.fade-leave-active {
  transition: all 10s linear;
}

//离开完成
.fade-leave-to {
  width: 0px;
  height: 0px;
}
</style>