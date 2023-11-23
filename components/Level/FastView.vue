<template>
  <div v-if="hover && hoverIndex === index" class="p-[4px] rounded-md bg-[#F5F5FD] h-8 w-8 flex items-center justify-center">
    <Icon class="m-0 h-[32px] w-[32px]" name="View" :size="22" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  hover: {
    type: Boolean,
    default: false,
  },
  hoverIndex: {
    type: Number,
    default: null,
  },
  index: {
    type: Number,
    default: null,
  }
})
</script>

<style scoped lang="scss">

</style>