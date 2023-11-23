<template>
  <div class="twitter-action-btn" @click="handleAction">
    <div class="twitter-action-btn_main" :class="{ disabled: !isDisabled }">
      <Icon :name="iconName" :size="26" />
      <span>{{ title }}</span>
    </div>
    <div
      v-if="!isDisabled"
      class="twitter-action-btn_secondary"
      :class="{ checked: isVeryfied || isLocalVeryfied }"
      @click.stop="checkVerification"
    >
      <Icon class="checked-icon" name="Tik" :size="24" v-if="isVeryfied || isLocalVeryfied" />
      <span class="loading-text" v-else-if="isLoading">
        <span class="loading-dots">
          <span class="loading-dot">.</span>
          <span class="loading-dot">.</span>
          <span class="loading-dot">.</span>
        </span>
      </span>
      <div v-else-if="isVerifyBtnDisabled">{{ time }}</div>
      <span v-else>Verify</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTasksStore } from '~/store/tasks';
const tasksStore = useTasksStore();
const route = useRoute();

const props = defineProps({
  title: { type: String, default: '' },
  isDisabled: { type: Boolean, default: false },
  isVeryfied: { type: Boolean, default: false },
  iconName: { type: String, default: 'Twitter-Default' },
  type: { type: String, default: '' },
  extraParram: { type: String, default: '' },
});
const isLocalVeryfied = ref(false);
const time = ref(10);
const emit = defineEmits(['action']);
const isVerifyBtnDisabled = ref(false);
const isLoading = ref(false);
const countDown = () => {
  time.value -= 1;
  return time.value;
};
const checkVerification = async () => {
  console.log(route.params.id);
  try {
    if (isVerifyBtnDisabled.value || props.isVeryfied || isLocalVeryfied.value || isLoading.value)
      return;
    isLoading.value = true;
    let verifyData;
    if (props.extraParram) {
      verifyData = await tasksStore.setUserTaskVerificationAction(
        route.params.id,
        props.type,
        props.extraParram,
      );
    } else {
      verifyData = await tasksStore.setUserTaskVerificationAction(route.params.id, props.type);
    }
    console.log('verifyData', verifyData);
    isLoading.value = false;
    isVerifyBtnDisabled.value = true;
    if (verifyData && verifyData.result) {
      isLocalVeryfied.value = true;
      isVerifyBtnDisabled.value = false;
      return;
    }
    if (!verifyData || (verifyData && !verifyData.result)) {
      time.value = 10;
      let interval = setInterval(() => {
        clearInterval(interval);
        countDown();
      }, 1000);
      setTimeout(() => {
        // time.value = 10;
        clearInterval(interval);
        isVerifyBtnDisabled.value = false;
      }, 10000);
    }
  } catch (error) {
    console.log('checkVerification error', error);
    isVerifyBtnDisabled.value = false;
    isLoading.value = false;
  }

  setTimeout(() => {
    isLoading.value = false;
    isVerifyBtnDisabled.value = true;
    let interval = setInterval(() => {
      countDown();
    }, 1000);
    setTimeout(() => {
      time.value = 10;
      clearInterval(interval);
      isVerifyBtnDisabled.value = false;
    }, 10000);
  }, 1000);
};

watch(isVerifyBtnDisabled, (value) => {
  console.log('isVerifyBtnDisabled', value);
});
const handleAction = () => {
  if (!props.isDisabled) {
    emit('action');
  }
};
</script>

<style lang="scss" scoped>
.checked-icon {
  filter: invert(99%) sepia(100%) saturate(2%) hue-rotate(117deg) brightness(105%) contrast(101%);
}
loading-dots {
  position: absolute;
  bottom: 0;
  left: 100%;
  display: inline-block;
  letter-spacing: 2px;
  margin-left: 5px;
}

.loading-dot:nth-child(1) {
  animation: loadingAnimation 3s infinite;
  animation-delay: 0s;
}
.loading-dot:nth-child(2) {
  animation: loadingAnimation2 3s infinite;
  animation-delay: 0s;
}
.loading-dot:nth-child(3) {
  animation: loadingAnimation3 3s infinite;
  animation-delay: 0s;
}

@keyframes loadingAnimation {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
}
@keyframes loadingAnimation2 {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
}
@keyframes loadingAnimation3 {
  0%,
  20% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
}

.twitter-action-btn {
  display: flex;
  gap: 2px;
  width: 100%;

  color: $default;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  &_main {
    display: flex;
    padding: 7px 16px;
    align-items: center;
    gap: 8px;

    width: 100%;
    height: 40px;
    border-radius: 8px;

    cursor: pointer;

    background: #dad9f7;
    border-radius: 8px;
    &.disabled {
      color: #6a6d8f;
      border-radius: 8px 0px 0px 8px !important;
    }
  }
  &_secondary {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
    border-radius: 0px 8px 8px 0px;
    background: #dad9f7;
    cursor: pointer;
    &.checked {
      background: #38405b;
    }
    &.disabled {
      color: #6a6d8f;
      background: #eaeafb;
    }
  }
}
</style>
