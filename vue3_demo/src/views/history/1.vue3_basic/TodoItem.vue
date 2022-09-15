<template>
  <div>{{ todo.text }}</div>
</template>

<script setup>
  const props = defineProps({
    todo: Object
  })
</script>