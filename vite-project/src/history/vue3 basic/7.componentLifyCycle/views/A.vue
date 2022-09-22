<template>
  <div>
    <div>我是子组件</div>
    <input type="text" v-model="msg" />
  </div>
</template>
<script setup lang="ts">
import { ref,onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted,onRenderTracked,onRenderTriggered,onActivated,onDeactivated } from 'vue'
/**
 * setup 替代了beforeCreate&created
*/
console.log('setup');

let msg = ref<string>('')
onBeforeMount(() =>{
  console.log('onBeforeMount');
})
onMounted(() =>{
  console.log('onMounted');
})
onBeforeUpdate(() =>{
  console.log('onBeforeUpdate');
})
onUpdated(() =>{
  console.log('onUpdated');
})
/**
 * 组件上使用v-show 是不会走下面两个生命周期
*/
onBeforeUnmount(() =>{
  console.log('onBeforeUnmount');
})
onUnmounted(() =>{
  console.log('onUnmounted');
})


/**
 * 使用了keep-alive 才会走下面两个生命周期
*/
onActivated(() =>{
  console.log('onActivated');
})

onDeactivated(() =>{
  console.log('onDeactivated');
})

// 调试使用
// onRenderTracked((e) =>{
//   console.log('onRenderTracked',e);
// })

// onRenderTriggered((e) =>{
//   console.log('onRenderTriggered',e);
// })


</script>
