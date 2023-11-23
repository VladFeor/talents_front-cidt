<template>
  <div @mouseover="isShowRewards = true" @mouseout="isShowRewards = false" class="more-btn_wrapper">
    <div class="more-btn">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <Tooltip v-if="isShowRewards" :data="data" :active="true" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isShowRewards = ref(false);
const props = defineProps({
  data: { type: Array, default: () => [] },
});
</script>

<style lang="scss" scoped>
.more-btn_wrapper {
  position: relative;
}
.more-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2px;
  width: 24px;
  height: 24px;
  background: $default-bg;
  border: 1px solid $default-badge-border;
  border-radius: 16px;
}
.dot {
  width: 3px;
  height: 3px;
  background: $default;
  border-radius: 50%;
}
</style>
