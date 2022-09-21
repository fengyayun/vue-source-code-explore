<template>
  <div>
    <!-- <button @click="changeName">修改name</button> -->
    <!-- <input type="text" v-model="message"> -->
  </div>
</template>

<script setup lang="ts">
/**
 * watch 使用方式 1.需要监听的值,2.监听变化回调 3.配置是否立即执行以及深度监听
 */

import { watch, ref, reactive } from 'vue'

/**
 * 案例1:监听非响应式变化的数据 没有任何作用
 * 
 let name: string = '小明'
watch(name, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})
const changeName = () => {
  name = '大明'
}
 */

 /**
  * 案例2 监听ref的值
 */
// let message = ref('')
// watch(message,(newValue,oldValue) =>{
//   console.log(newValue,oldValue);
// })


/**
 * 案例3 监听reactive 的值  特殊：监听reactive 默认自带deep:true
*/
// const reactiveData = reactive({
//   obj:{
//     name:2
//   }
// })
// const changeName = () =>{
//   reactiveData.obj.name = 10
// }
// watch(reactiveData,(newValue) =>{
//   console.log(newValue);
// })

</script>

<style scoped></style>
