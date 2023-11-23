<template>
  <div class="main">
    <div class="box" :class="{ small }">
      <div class="progress" :style="`width: ${percentage}%`"></div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  percentage: String | Number,
  small: Boolean,
});
</script>
<style scoped lang="scss">
.main {
  width: 100%;
  .box {
    margin-bottom: 12px;
    background: $white;
    border: 1px solid $orange;
    border-radius: 16px;
    padding: 1px;
    .progress {
      height: 12px;
      background: linear-gradient(90deg, $orange 0%, $dot_bg 100%);
      border-radius: 16px;
    }
  }
  .small {
    border-radius: 16px;
    border: 1px solid var(--secondary-90, #eaeafb);
    background: var(--secondary-95-selago, #f5f5fd);
    padding: 0;
    .progress {
      height: 6px;
      background: linear-gradient(90deg, $orange 0%, $dot_bg 100%);
      border-radius: 16px;
    }
  }
}
</style>
