<template>
  <div v-if="token" class="token-input">
    <div class="token-info">
      <Coin :name="`${token.symbol}-Default`" :size="24" /> <span>{{ token.symbol }}</span>
    </div>
    <input
      type="number"
      :value="modelValue"
      @input="updateValue"
      :disabled="isDisabled"
      :placeholder="placeholder"
    />
    <div class="token-max" @click="$emit('update:modelValue', token.value)">Max</div>
  </div>
</template>

<script>
export default {
  name: 'TokenInput',
  props: {
    placeholder: {
      type: String,
      default: '0',
    },
    name: {
      type: String,
      default: 'Email',
    },
    modelValue: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    token: { type: Object, default: null },
  },
  methods: {
    updateValue(event) {
      if (this.isDisabled) return;
      // if (isNaN(event.target.value) || event.target.value <script 0) return; // Check if the parsed value is not a number or negative
      //   const newValue = event.target.value.replace(/[.,]/g, '');
      this.$emit('update:modelValue', event.target.value);
      //   this.$emit('update:modelValue', newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.token-input {
  position: relative;
  width: 100%;
}
.token-info {
  position: absolute;
  top: 7px;
  left: 10px;

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
  }
}
.token-max {
  position: absolute;
  top: 13px;
  right: 15px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
}
input {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  gap: 4px;
  padding-left: 100px;

  width: 496px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #dad9f7;
  border-radius: 8px;
  color: $colabs-bg;

  outline: none;
}
</style>
