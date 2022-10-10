<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
    <!-- <div>
      <div v-for="item in 100" :key="item">
        <div>
          <slot :data="item"></slot>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped></style>