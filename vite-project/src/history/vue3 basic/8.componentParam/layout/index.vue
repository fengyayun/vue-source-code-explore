<template>
  <div class="layout">
    <Menu></Menu>
    <div class="layout-right">
      <Header></Header>
      <Content ref="content" @on-click="parentClick"  title="我是父组件传递进来的"></Content>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Menu from './menu/index.vue'
import Header from './header/index.vue'
import Content from './content/index.vue'
const data = reactive([1, 2, 3])
const parentClick = (list:number[]) =>{
  console.log(list);
}
const content = ref(null)
onMounted(() => {
  console.log(content.value);
})
</script>

<style scoped lang="less">
.layout {
  display: flex;
  width: 100%;
  height: 100%;
  &-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
