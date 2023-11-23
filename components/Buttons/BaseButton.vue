<template>
  <BtnSkeleton v-if="loading" />
  <div
    v-else
    :class="[type, { disabled }]"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span class="loading-text" v-if="loadingAnimation"
      >{{ loadingText }}
      <span class="loading-dots" v-if="loadingDots">
        <span class="loading-dot">.</span>
        <span class="loading-dot">.</span>
        <span class="loading-dot">.</span>
      </span>
    </span>
    <span v-else>{{ text }}</span>
    <div v-if="isTooltipActive" class="btn-tooltip_wrapper">
      <BtnTooltip :data="tooltipText" :active="isHovered" :left="tooltipLeftPosition"/>
    </div>
    <img v-if="type == 'base' && !disableImage" src="@/assets/icons/plus.svg" alt="" />
    <slot v-if="!loadingAnimation"></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseButton',
  data() {
    return {
      isHovered: false,
    };
  },
  props: {
    text: String,
    type: {
      type: String,
      default: 'base',
    },
    loading: { type: Boolean, default: false },
    isTooltipActive: { type: Boolean, default: false },
    tooltipText: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    loadingAnimation: { type: Boolean, default: false },
    loadingText: { type: String, default: '' },
    loadingDots: { type: Boolean, default: true },
    tooltipLeftPosition: {type: String, default:'-30px'},
  },
};
</script>

<style scoped lang="scss">
.btn-tooltip_wrapper {
  position: relative;
}
.loading-text {
  position: relative;
}

.loading-dots {
  position: absolute;
  bottom: 0;
  left: 100%;
  display: inline-block;
  letter-spacing: 2px;
  margin-left: 5px;
}

.loading-dot:nth-child(1) {
  animation: loadingAnimation 3s infinite;
  animation-delay: 0s;
}

.loading-dot:nth-child(2) {
  animation: loadingAnimation2 3s infinite;
  animation-delay: 0s;
}

.loading-dot:nth-child(3) {
  animation: loadingAnimation3 3s infinite;
  animation-delay: 0s;
}

@keyframes loadingAnimation {

  0%,
  20% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }

  60% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }
}

@keyframes loadingAnimation2 {

  0%,
  20% {
    opacity: 0;
  }

  40% {
    opacity: 0;
  }

  60% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }
}

@keyframes loadingAnimation3 {

  0%,
  20% {
    opacity: 1;
  }

  40% {
    opacity: 0;
  }

  60% {
    opacity: 0;
  }

  80% {
    opacity: 1;
  }
}

.secondary {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  background: $default-border;
  border-radius: 8px;
  cursor: pointer;

  width: 100%;
  height: 40px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;

  &.disabled {
    background: transparent;
    color: $default-border;
    border-radius: 8px;
    border: 1px solid $default-border;

    &:hover {
      background: transparent;
      color: $default-border;
      border-radius: 8px;
      border: 1px solid $default-border;
    }
  }

  &:hover {
    background: $default-badge-border;
  }
}

.normal {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  background: #fc660c;
  border-radius: 8px;
  cursor: pointer;

  width: 100%;
  height: 40px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;

  &.disabled {
    background: transparent;
    color: $default-border;
    border-radius: 8px;
    border: 1px solid $default-border;

    &:hover {
      background: transparent;
      color: $default-border;
      border-radius: 8px;
      border: 1px solid $default-border;
    }
  }

  &:hover {
    background: $orange-active;
  }
}

.action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px;
  gap: 8px;
  background: #fc660c;
  border-radius: 8px;
  cursor: pointer;

  width: 240px;
  height: 40px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $white;

  &:hover {
    background: $orange-active;
  }
}

.base {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: fit-content;
  height: 40px;
  background: $orange;
  display: flex;
  cursor: pointer;
  align-items: center;

  &:hover {
    background: $orange-active;
  }

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    color: $white;
  }

  img {
    margin-left: 8px;
  }
}

.level {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  width: 80px;
  height: 32px;
  background: $default-border;
  border-radius: 8px;

  &:hover {
    cursor: pointer;
    background: $default;

    span {
      color: $white;
    }
  }

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
  }
}</style>
