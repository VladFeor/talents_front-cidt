<template>
  <div class="input">
    <div class="name">Email Address</div>
    <div class="description" v-if="description">{{ description }}</div>
    <input
      type="text"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :class="{ error: isError || invalid }"
    />
    <div class="error-message" v-if="isError || invalid">Invalid email address</div>
  </div>
</template>

<script>
export default {
  name: 'EmailInput',
  props: {
    placeholder: {
      type: String,
      default: 'Input text',
    },
    description: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isError: false,
    };
  },
  methods: {
    updateValue(event) {
      const newValue = event.target.value;
      this.isError = !this.validateEmail(newValue);
      this.$emit('update:modelValue', newValue);
      this.$emit('error', this.isError);
    },
    validateEmail(email) {
      const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return regex.test(email);
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

  .error-message {
    color: $error-text;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-top: 8px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  }

  .name {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }

  .description {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
    margin-top: 4px;
    margin-bottom: 8px;
  }

  input {
    margin-top: 8px;
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

    &:focus:not(.error) {
      border: 3px solid $default-border;
    }
  }
}
</style>
