<template>
  <div>
    <div v-for="item in list" :key="item">{{ item }}</div>
  </div>
</template>
<script setup lang="ts">
let req = () =>{
  return new Promise((resolve) =>{
    setTimeout(() => {
      resolve([1,2,3])
    }, 3000);
  })
}
let list = await req()
console.log(`list=${list}`);

</script>
<style lang="scss"></style>