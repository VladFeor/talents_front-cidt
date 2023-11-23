<template>
  <div class="tooltip-icon" @mouseover="isHovered = true" @mouseleave="isHovered = false">
    <div class="tooltip-checkbox" :class="{ isLeft }" v-if="isHovered && tooltipText">
      {{ props.tooltipText }}
    </div>

    <Icon class="hovered" name="Info-1px-color" :size="24" />
    <Icon class="def" name="Info-1px" :size="24" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isHovered = ref(false);

const props = defineProps({
  text: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  tooltipText: { type: String, default: '' },
  isLeft: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.tooltip-icon {
  position: relative;
  cursor: pointer;
  .hovered {
    display: none !important;
  }
  .def {
    display: inline-block !important;
  }
  &:hover {
    .tooltip-checkbox {
      opacity: 1;
    }
    .hovered {
      display: inline-block !important;
    }
    .def {
      display: none !important;
    }
  }
}
.tooltip-checkbox {
  opacity: 0;
  position: absolute;
  bottom: -10px;
  // width: 200px;
  min-width: 170px;
  width: fit-content;
  left: 50%;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  z-index: 9999999;
  transform: translateY(100%) translateX(-50%);
  margin-bottom: 5px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;

  &.isLeft {
    left: -50px;
    &:after {
      left: 147px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg) translateX(-50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: -1;
    top: 10px;
    left: 50%;
  }
}
</style>
