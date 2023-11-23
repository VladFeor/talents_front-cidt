<template>
  <div class="add-address_wrapper-btn" @click="isTooltipActive = true">
    <div class="add-address-btn" :class="[{ isBorder, 'active-title': isTooltipActive }]">
      <span>{{ title }}</span>
      <Icon name="Add" :size="20" />
    </div>
    <div v-if="isTooltipActive" id="tooltip-transaction-btn">
      <div class="tooltip-arrow"></div>
      <div class="menu">
        <div class="link" @click="handleCloseConnectModal(true)">Connect Wallet</div>
        <div class="transaction-btn-line"></div>
        <div class="link" @click="handleEnterAddressModal(true)">Enter Manually</div>
      </div>
    </div>
  </div>
  <BaseModal
    :width="480"
    top="250"
    @close="handleCloseConnectModal($event)"
    :visible="isShowConnectModal"
  >
    <ConnectWalletModal @close="isShowConnectModal = false" />
  </BaseModal>
  <BaseModal
    :width="496"
    top="250"
    @close="handleEnterAddressModal($event)"
    :visible="isEnterAddressModal"
  >
    <EnterWalletAddressModal @close="isEnterAddressModal = false" />
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Add Address' },
  isBorder: { type: Boolean, default: false },
});

document.body.addEventListener('click', (event) => {
  const wrapper = document.querySelector('.add-address_wrapper-btn');

  // Check if the click event target is outside the wrapper and its children
  if (!wrapper.contains(event.target)) {
    isTooltipActive.value = false;
  }
});

const isTooltipActive = ref(false);
const isShowConnectModal = ref(false);
const isEnterAddressModal = ref(false);

const handleTooltip = () => {
  isTooltipActive.value = !isTooltipActive.value;
};

const handleCloseConnectModal = (event) => {
  isShowConnectModal.value = event;
  isTooltipActive.value = false;
};

const handleEnterAddressModal = (event) => {
  isEnterAddressModal.value = event;
  isTooltipActive.value = false;
};
</script>

<style lang="scss" scoped>
.add-address_wrapper-btn {
  position: relative;
}
.add-address-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  width: fit-content;
  height: 32px;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $secondary;
  &.active-title {
    background-color: $default-border;
  }
  &.isBorder {
    border: 1px solid $default-border;
  }
  &:hover {
    background: $default-badge-border;
    color: $default;
  }
}
#tooltip-transaction-btn {
  position: absolute;
  height: fit-content;
  margin-top: 6%;
  background: $white;
  top: 30px;
  right: -5px;
  //   margin-left: 0px;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  width: 144px;
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
      color: $default;
      font-variant-numeric: slashed-zero;
      font-family: Basis Grotesque Pro;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */

      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 8px;
      width: 100%;
      // height: 24px;
      background: $white;
      border-radius: 6px;
      &:hover {
        background: $default-badge-border;
        cursor: pointer;
      }
    }
  }
}
</style>
