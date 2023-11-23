<template>
  <div @click="hadleClick" class="claim-btn">
    {{ text }}
  </div>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  action: { type: Function, default: '' },
});

const hadleClick = () => {
  props.action();
};
</script>

<style lang="scss" scoped>
.claim-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  width: 64px;
  height: 32px;
  background: #dad9f7;
  border-radius: 8px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
  &:hover {
    background: $default;
    color: $white;
  }
}
</style>
