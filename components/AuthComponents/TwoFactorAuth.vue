<template>
  <div class="two-factor-auth">
    <span class="title"
      >Enter the authentication code <br />
      from the application</span
    >
    <div class="input-container">
      <input
        class="auth-input"
        v-for="(input, index) in 6"
        :key="index"
        v-model="code[index]"
        @input="handleInput"
        @keypress="isNumber"
        @keydown.delete="handleDelete"
        @paste="onPaste"
        maxlength="1"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        ref="inputRefs"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoFactorAuth',
  data() {
    return {
      digits: [0, 1, 2, 3, 4, 5],
      code: [],
      dataFromPaste: [],
      keysAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    };
  },
  methods: {
    isNumber(event) {
      event.currentTarget.value = '';
      const keyPressed = event.key;
      if (!this.keysAllowed.includes(keyPressed)) {
        event.preventDefault();
      }
    },
    handleInput(event) {
      const inputType = event.inputType;
      let currentActiveElement = event.target;
      if (inputType === 'insertText') currentActiveElement.nextElementSibling?.focus();
      if (inputType === 'insertFromPaste' && this.dataFromPaste) {
        for (const num of this.dataFromPaste) {
          let id = parseInt(currentActiveElement.id.split('_')[1]);
          currentActiveElement.value = num;
          this.code[id] = num;
          if (currentActiveElement.nextElementSibling) {
            currentActiveElement = currentActiveElement.nextElementSibling;
            currentActiveElement.nextElementSibling?.focus();
          }
        }
      }
    },
    handleDelete(event) {
      let value = event.target.value;
      let currentActiveElement = event.target;
      if (!value) currentActiveElement.previousElementSibling?.focus();
    },
    onPaste(event) {
      this.dataFromPaste = event.clipboardData?.getData('text').trim().split('');
      if (this.dataFromPaste) {
        for (const num of this.dataFromPaste) {
          if (!this.keysAllowed.includes(num)) event.preventDefault();
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.two-factor-auth {
  display: flex;
  margin-top: 40px !important;
  justify-content: center;
  flex-direction: column;

  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    hanging-punctuation: first last;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
    color: $default;
  }
}

.input-container {
  display: flex;
  margin: 0 auto;
  margin-top: 24px;
}

.auth-input {
  width: 48px;
  height: 48px;
  text-align: center;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  margin-right: 16px;
  outline: none;
  color: $default;

  &:last-child {
    margin-right: 0;
  }
}

</style>
