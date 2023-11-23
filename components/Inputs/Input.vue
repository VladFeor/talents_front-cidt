<template>
  <div class="input">
    <div v-if="!withoutName" class="name">{{ name }}</div>
    <input
      type="text"
      :class="{ error: !rule && touched }"
      :value="modelValue"
      @blur="touched = true"
      @focus="touched = false"
      @input="updateValue"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    placeholder: {
      type: String,
      default: 'Input text',
    },
    name: {
      type: String,
      default: 'Email',
    },
    modelValue: {
      type: String,
      default: '',
    },
    rule: {
      type: Boolean,
      default: true,
    },
    withoutName: { type: Boolean, default: false },
  },
  data() {
    return {
      touched: false,
    };
  },
  methods: {
    updateValue(event) {
      const newValue = event.target.value;
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;

  .error {
    border-color: $error-border;
  }

  .name {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    margin-bottom: 8px;
  }

  input {
    height: 40px;
    width: 100%;
    outline: none;
    background: $white;
    border: 1px solid $colabs-bg;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;

    &::placeholder {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
    }

    &:focus {
      border: 3px solid $default-border;
    }
  }
}
</style>
