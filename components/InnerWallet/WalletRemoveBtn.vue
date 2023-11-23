<template>
  <div class="transaction-btn" @click="handleTooltip" :data-index="index">
    <Icon icon="Delete-def" :size="24" :data-index="index"></Icon>
  </div>
  <div v-if="isTooltipActive" id="tooltip-transaction-btn">
    <div class="menu">
      <span>Confirm the cancellation of the withdrawal request</span>
      <div class="menu-btns">
        <div class="link" @click="isTooltipActive = false"><span>Cancel</span></div>
        <div class="link red" @click="handleRemove"><span>Confirm</span></div>
      </div>
    </div>
  </div>
  <Loader v-if="isLoading" />
</template>

<script setup>
import { useInnerWalletStore } from '~/store/innerWallet';

const nuxtApp = useNuxtApp();

const innerWalletStore = useInnerWalletStore();

const props = defineProps({
  index: { type: Number, default: 0 },
  page: { type: Number, default: 0 },
});

const isTooltipActive = ref(false);
const isLoading = ref(false);

const handleTooltip = () => {
  isTooltipActive.value = !isTooltipActive.value;
};

const handleRemove = async () => {
  try {
    await innerWalletStore.deleteWithdrawRequestAction(props.index);
    await innerWalletStore.getWithdrawalRequestsAction({ page: props.page });
    nuxtApp.$alert.show('Request removed', {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

function closeDropdown(event) {
  if (+event.target.getAttribute('data-index') !== props.index) {
    //   if (!event.target.closest('.transaction-btn')||+event.target.getAttribute('data-index') !== props.index) {
    isTooltipActive.value = false;
  }
}
</script>

<style lang="scss" scoped>
.menu-btns {
  display: flex;
}
.transaction-btn-line {
  width: 100%;
  height: 1px;
  background: rgba(218, 217, 247, 1);
}
.transaction-btn {
  display: flex;
  width: 32px;
  height: 32px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: #f5f5fd;
  &:hover {
    background: #eaeafb;
  }
}
#tooltip-transaction-btn {
  position: absolute;
  height: fit-content;
  margin-top: 6%;
  background: $white;
  top: 55px;
  margin-left: -150px;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  width: 200px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  z-index: 99;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 80%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
  }
  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;
    .red {
      color: $red !important;
    }
    .link {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      font-feature-settings: 'zero' on;
      color: $section-title;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 3px 8px;
      width: 100%;
      height: 24px;
      background: $white;
      border-radius: 6px;
      &:hover {
        background: $default-bg;
        cursor: pointer;
      }
    }
  }
}
</style>
