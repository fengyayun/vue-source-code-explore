<template>
  <div class="app">
    <Teleport :disabled="true" to="#app">
      <Dialog></Dialog>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
  import Dialog from './views/Dialog.vue'
</script>
<style scoped lang="less">
  .app {
    width: 100%;
    height: 50vh;
    // position: relative;
    background: yellow;
  }
</style>