<template>
  <div>
    <input id="ipt" type="text" v-model="message">
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, watchEffect} from 'vue'

const message = ref('')
/**
 * watchEffect 会传入一个函数 默认执行一次 然后会收集函数中响应式的依赖，
*/
// watchEffect((oninvalidate) =>{
//   console.log('message',message.value);
// })

/**
 * watchEffect 可以在触发监听之前调用一个函数处理自己的逻辑
*/
// watchEffect((oninvalidate) =>{
//   oninvalidate(() =>{
//     console.log('oninvalidate',message.value);
//   })
//   console.log('message',message.value);
// })



/**
 * watchEffect 返回一个函数用于处理停止监听的逻辑
*/
// const stop = watchEffect((oninvalidate) =>{
//   oninvalidate(() =>{
//     console.log('oninvalidate',message.value);
//   })
//   console.log('message',message.value);
// })
// stop()


/**
 * watchEffect 调用时机
*/
watchEffect(() =>{
  console.log('message',message.value);
  const ipt = document.querySelector('#ipt');
  console.log(ipt);
},{
  flush:'post'
})

</script>

<style scoped></style>
