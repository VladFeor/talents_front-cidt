<template>
  <div class="checkbox">
    <input
      type="checkbox"
      id="checkbox"
      class="custom-checkbox"
      @input="$emit('change', checked)"
      v-model="checked"
    />
    <label for="checkbox" v-if="label">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  data() {
    return {
      checked: false,
    };
  },
  props: {
    label: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.checkbox {
  display: flex;
  align-items: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}

.custom-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  position: relative;
  outline: none;
}

.custom-checkbox:checked:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: $default;
}

.checkbox-label {
  cursor: pointer;
}
</style>
