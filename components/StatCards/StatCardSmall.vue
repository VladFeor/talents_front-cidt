<template>
  <div class="main" :class="[{ no: value == 0 }, { active: isActive }]">
    <div class="value w-full">
      {{
        value == 0
          ? 'No'
          : reduceStringLength(
              String(formatNumber(value)),
              String(formatNumber(value)).includes('.') ? 5 : 4,
              false,
            )
      }}
    </div>
    <div class="info">
      <div class="title">{{ title }}</div>
      <Icon
        class="icon"
        :size="24"
        :icon="getIconByName(title)"
        :class="{ 'progress-color': title === 'in progress' }"
      />
    </div>
  </div>
</template>

<script>
import { getIconByName, formatNumber } from '@/util/helpers';
import { reduceStringLength } from '@/util/helpers';

export default {
  name: 'StatCardSmall',
  props: {
    icon: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
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
  data() {
    return {
      getIconByName,
      formatNumber,
      reduceStringLength,
    };
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 178px;
  height: 120px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  font-family: 'Basis Grotesque Pro';
  &.no {
    &.active {
      .value {
        color: $white;
      }
      .title {
        color: $white;
      }
      .icon {
        filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%)
          contrast(102%);
      }
    }
    .value {
      color: $colabs-bg;
    }
    .title {
      color: $colabs-bg;
    }
    .icon {
      filter: invert(73%) sepia(16%) saturate(458%) hue-rotate(205deg) brightness(92%) contrast(50%);
      &.progress-color {
        filter: invert(90%) sepia(23%) saturate(542%) hue-rotate(180deg) brightness(104%)
          contrast(95%);
      }
    }
  }

  &.active {
    background-image: url('@/assets/images/active-card-small.svg') !important;
    .value,
    .title {
      color: $white;
    }

    * {
      color: $white;
    }
    .icon {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(320deg) brightness(101%)
        contrast(102%);
    }
    &:hover {
      background-image: url('@/assets/images/active-card-small-hover.svg') !important;
    }
  }

  .value {
    color: $default;
    font-weight: 350;
    font-size: 56px;
    line-height: 56px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: $default;
    white-space: nowrap;
  }
  .info {
    font-style: normal;
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 24px;
  }
  &:hover {
    background: $default-border;
  }
}
</style>
