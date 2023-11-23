<template>
  <form class="switch-field">
    <div v-for="(button, idx) in buttons" :key="idx">
      <input
        type="radio"
        :id="`${uniqueId}-${button.title}`"
        :name="uniqueId"
        :value="button.id"
        :checked="id === button.id"
        :class="{ active: id === button.id }"
      />
      <label
        :class="[button.type, { big: big }]"
        :style="[{ 'background-color': button.backColor || '' }, { 'color': button.color }]"
        @click="$emit('select', button.id)"
        :for="`${uniqueId}-${button.title}`"
        >{{ button.title }} <span v-if="button.value !== undefined" class="value">{{ button.value }}</span></label
      >
    </div>
  </form>
</template>

<script>
export default {
  name: 'BadgeToggle',
  props: {
    buttons: {
      type: Array,
      default: Array.of({
        title: { type: String, default: 'click' },
        id: { type: Number, default: 1 },
      }),
    },
    id: { type: Number, default: 0 },
    type: {
      type: String,
      default: '',
    },
    big: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uniqueId: this.generateUniqueId(),
    };
  },
  methods: {
    generateUniqueId() {
      return `switch-${Math.random().toString(36).substr(2, 9)}`;
    },
  },
};
</script>

<style scoped lang="scss">
input {
  display: none;
}
.switch-field {
  display: flex;
  gap: 12px;

  input {
    &:checked + label {
      background: $default-border;
      color: $section-title;
      border-radius: 6px;
    }
    .active + label {
      background: $default-border;
      color: $section-title;
      border-radius: 6px;
    }
  }

  .switch-item {
    display: flex;
    align-items: center;
    width: max-content;
    height: 100%;
  }

  label {
    display: flex;
    color: $default;
    background: $default-bg;
    padding: 4px 8px;
    border-radius: 6px;
    height: 24px;
    width: fit-content;
    display: flex;
    align-items: center;
    border: 1px solid $default-badge-border;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    color: $default;

    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    /* identical to box height, or 133% */

    text-align: center;
    letter-spacing: 0.014em;
    span {
      margin-left: 5px;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .success {
    border: none;
    background: $success-bg;
    span {
      color: $success-text;
    }
  }

  .warning {
    border: none;
    background: $warning-bg;
    span {
      color: $warning-text;
    }
  }

  .danger {
    border: none;
    background: $danger-bg;
    span {
      color: $danger-text;
    }
  }

  .primary {
    border: none;
    background: $primary-bg;
    span {
      color: $primary-text;
    }
  }

  .info {
    border: none;
    background: $info-bg;
    span {
      color: $info-text;
    }
  }

  .mint {
    border: none;
    background: $mint-bg;
    span {
      color: $mint-text;
    }
  }

  .rounded {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    border: none;
    background: $rounded-bg;
    span {
      color: $orange;
    }
  }

  .transparent {
    border: 1px solid $default-border;
    background: transparent;
    span {
      color: $default;
    }
  }

  .image {
    padding-left: 2px;
    border: 1px solid $default-border;
    background: transparent;
    span {
      color: $default;
    }
  }

  .big {
    height: 32px !important;
    width: max-content;
    max-width: fit-content;
    display: flex;
    align-content: center;
    span {
      font-size: 14px;
      line-height: 20px;
    }
    .value {
      font-size: 12px;
    }
  }
}
</style>
