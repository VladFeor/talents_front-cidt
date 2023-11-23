<template>
  <div class="back-btn" @click="router.push(to)">
    <Icon name="Left-Arrow" :size="24" />
    <Talent
      :text="text"
      :img="img"
      :square="isRounded === false ? true : false"
      :reduceLength="15"
      big
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  text: { type: String, default: '' },
  img: { type: String, default: '' },
  to: {
    type: String,
    default: '/',
  },
  isRounded: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.back-btn {
  width: fit-content;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid $default-border;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: $default-border;
  }
}
</style>
