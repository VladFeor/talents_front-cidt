<template>
  <div class="main" :class="[{ no: value == 0 }, { active: isActive }]">
    <Icon class="icon" :size="24" :icon="getIconByName(title)" />
    <div class="info">
      <div class="value w-full">{{ value == 0 ? 'No' : value }}</div>
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>

<script>
import { getIconByName } from '@/util/helpers';

export default {
  name: 'StatCardBig',
  data() {
    return {
      getIconByName,
    };
  },
  props: {
    icon: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '25',
    },
    title: {
      type: String,
      default: 'text',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.no {
  .value {
    color: $colabs-bg !important;
  }
  .title {
    color: $colabs-bg !important;
  }
  .icon {
    filter: invert(73%) sepia(16%) saturate(458%) hue-rotate(205deg) brightness(92%) contrast(50%) !important;
  }
}

.main {
  width: 178px;
  height: 204px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  .info {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    margin-top: 60px;

    .value {
      color: $default;
      font-weight: 350;
      font-size: 56px;
      line-height: 72px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    }
    .title {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: $default;
      white-space: nowrap;
    }
  }
  &:hover {
    background: $default-border;
  }
}

.active {
  background-image: url('@/assets/images/active-card-big.svg') !important;
  * {
    color: $white !important;
  }
  .icon {
    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%) contrast(102%);
  }
  &:hover {
    background-image: url('@/assets/images/active-card-big-hover.svg') !important;
  }
}

</style>
