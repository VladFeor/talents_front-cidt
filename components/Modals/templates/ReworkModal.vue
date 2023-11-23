<template>
  <div class="rework-modal">
    <div class="rework-modal_content">
      <div class="rework-modal_title">Returning the Task for Rework</div>
      <div class="rework-modal_user-card">
        <div class="rework-modal_user-card_header">
          <Talent text="test" />
          <div class="rework-modal_user-card_date">Mar 12, 14:32</div>
        </div>
        <div class="rework-modal_user-card_btns">
          <div class="rework-modal_user-card_btn">
            <Icon name="Insert-Link" :size="24" />
            <div class="rework-modal_user-card_text">https://docs.google.com/...</div>
          </div>
          <div class="rework-modal_user-card_btn">
            <Icon name="Insert-Link" :size="24" />
            <div class="rework-modal_user-card_text">Document.pdf</div>
          </div>
        </div>
        <div class="rework-modal_user-card_desc">
          There are many variations of passages of Lorem Ipsum available, but the majority have
          suffered alteration in some form, by injected humour, or randomised words which don't look
          even slightly believable.
        </div>
      </div>
      <div class="rework-modal_message">
        <div class="rework-modal_message-title">Message</div>
        <div class="rework-modal_message-subtitle">
          Explain the reason for the task return. Describe what needs to be improved.
        </div>
        <TextArea v-model="description" />
      </div>
    </div>
    <div class="rework-modal_btn">
      <BaseButton text="Return for Rework" type="normal" @click="emit('action')" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['action', 'input']);
const description = ref('');

watch(description, (value) => {
  if (value) {
    emit('input', value);
  }
});
</script>

<style lang="scss" scoped>
.rework-modal {
  height: 96vh;
  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  justify-content: space-between;
  flex-direction: column;
  padding: 40px;
  &_user-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 24px;
    width: 520px;
    height: 232px;
    background: #eaeafb;
    border-radius: 16px;
    &_desc {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #1a1d29;
    }
    &_btns {
      display: flex;
      justify-content: flex-start;
      gap: 16px;
    }
    &_btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 16px 8px 12px;
      gap: 8px;
      width: fit-content;
      height: 40px;
      background: #f5f5fd;
      border: 1px solid #dad9f7;
      border-radius: 6px;
    }
    &_text {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      text-align: right;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #38405b;
    }
    &_header {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    &_date {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      text-align: right;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
  &_content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 40px;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: #1a1d29;
  }
  &_message {
    display: flex;
    flex-direction: column;
    gap: 5px;
    &-title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #1a1d29;
    }
    &-subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
  &_btn {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
