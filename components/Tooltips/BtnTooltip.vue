<template>
  <div class="tooltip-component" :class="{ active }" :style="{ width: width, height: height, left: left, }">
    <div class="tooltip-item">
      <span class="tooltip-content">{{ reduceStringLength(data, 100) }}</span>
    </div>
  </div>
</template>

<script>
import { reduceStringLength } from '@/util/helpers';

export default {
  name: 'Tooltip',
  data() {
    return { reduceStringLength };
  },
  props: {
    data: { type: Array, default: [] },
    active: { type: Boolean, default: false },
    width: { type: String, default: 'fit-content' },
    height: { type: String, default: 'auto' },
    left: { type: String, default: '-30px' }
  },
};
</script>

<style scoped lang="scss">
.tooltip-component {
  display: none;
  position: absolute;
  z-index: 999;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 14px;
  line-height: 1.5;
  width: fit-content;
  white-space: nowrap;
  height: auto;
  min-height: 32px;
  top: 43px;
  transform: translate(-50%, -50%);
  &.active {
    display: block;
  }
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    top: 11px;
    left: 50%;
    right: 50%;
    transform: rotate(45deg) translate(-50%, -10%);
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default-border;
  }
  .tooltip-content {
    position: relative;
    z-index: 20;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $white;
    padding-left: 8px;
  }
}
</style>
