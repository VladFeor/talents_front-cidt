<template>
  <div class="talent" :class="{ square }">
    <img :src="img || defaultBg" alt="" />
    <span>{{ reduceStringLength(text, 20) }}</span>
    <span class="project-value">{{ value }}</span>
  </div>
</template>

<script>
import defaultBg from '@/assets/images/default-avatar.png';
import { reduceStringLength } from '@/util/helpers';
export default {
  name: 'Talent',
  data() {
    return {
      reduceStringLength,
      defaultBg,
    };
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    value: { type: String, default: '' },
    img: String,
    square: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
.project-value {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $secondary;
}
.talent {
  display: flex;
  align-items: center;
  gap: 8px;
  &.square {
    img {
      border-radius: 6px;
    }
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
  }
  img {
    width: 24px;
    height: 24px;
    border-radius: 40px;
  }
}
</style>
