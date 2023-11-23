<template>
  <div class="flex flex-col gap-[8px] w-full">
    <div class="title">{{ index + '.' }} {{ question }}</div>
    <textarea
      class="w-full"
      :value="modelValue"
      @input="updateValue"
      @blur="touched = true"
      @focus="touched = false"
      placeholder="Write your answer"
    ></textarea>
  </div>
  <span class="error-msg" :class="{ block: !modelValue && touched }"> Write your answer</span>
  <span class="error-msg" :class="{ block: modelValue.length > 255 }">
    Answer is greater than 255 characters</span
  >
</template>
<script setup>
const emit = defineEmits(['update:modelValue']);
const touched = ref(false);
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  question: {
    type: String,
    default: '',
  },
  index: {
    type: String,
    default: '',
  },
});

function updateValue(event) {
  const newValue = event.target.value;
  emit('update:modelValue', newValue);
}
</script>
<style scoped lang="scss">
.block {
  display: block !important;
}
.error-msg {
  display: none;
  color: $error-text;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: -8px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}
.title {
  color: $section-title;
  font-variant-numeric: slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
}
textarea {
  display: flex;
  min-height: 72px;
  padding: 12px;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid $default-border;
  background: $white;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: $section-title;
  outline: none;
  &::placeholder {
    color: $colabs-bg;
  }
}
</style>
