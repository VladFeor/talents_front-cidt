<template>
  <div class="withdraw-modal">
    <div class="withdraw-modal-title">Withdrawal</div>
    <div class="withdraw-modal-section">
      <div v-if="token" class="withdraw-modal-section-title">Amount of Tokens</div>
      <TokenInput v-if="token" v-model="tokenValue" :placeholder="0" :token="token" />
      <div v-if="token" class="withdraw-modal-amout-info">
        <span>Minimum 0.00001 {{ token.symbol }}</span>
        <span>Available {{ token.value }} {{ token.symbol }}</span>
      </div>
    </div>
    <div v-if="addressesValue && addressesValue.length" class="withdraw-modal-section">
      <div class="withdraw-modal-section-title">Address</div>
      <div class="withdraw-modal-section-subtitle">
        Choose one of the saved addresses or add a new one
      </div>
      <SelectInput
        :options="addressesValue"
        :isDisabled="isClaimBtnActive"
        @input="setAddress"
        :typeOfChain="token.typeOfChain"
      />
    </div>

    <div v-if="isAddInputActive" class="add-address-input">
      <div v-if="isAddressValid" class="add-address-btn_wrapper">
        <Icon name="Tik" :size="24" />
      </div>
      <input type="text" placeholder="Enter withdrawal address" v-model="addressModel" />
    </div>
    <div
      class="manage-modal_add_wrapper"
      :class="{ zero: walletsAddresses && !walletsAddresses.length }"
    >
      <NewAddAddressBtn title="Add Address" />
    </div>

    <BaseButton
      v-if="isAddInputActive"
      text="Confirm the address"
      type="secondary"
      @click="handleAddAddress"
      :disabled="!isAddressValid ? true : false"
    />
    <BaseButton
      class="mt-7"
      text="Claim"
      type="normal"
      :disabled="isClaimBtnActive"
      @click="handleClaim"
      :isTooltipActive="isClaimBtnActive"
      tooltipText="Add wallet address for withdrawal on this  blockchain"
    />
  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useBlockchainsStore } from '@/store/blockchains';
import { useInnerWalletStore } from '~/store/innerWallet';
import { useAddressStore } from '~/store/address';
import { TYPE_OF_CHAIN } from '~/web3/connection';
import { isValidSeiAddress } from '@sei-js/core';
import { isValidTronAddress, isValidAptosAddress } from '~/web3/helpers';

const nuxtApp = useNuxtApp();

const innerWalletStore = useInnerWalletStore();
const blockchainsStore = useBlockchainsStore();
const addressStore = useAddressStore();

const props = defineProps({
  addresses: { type: Array, default: null },
  token: { type: Object, default: null },
});

const emit = defineEmits(['openAddWallet', 'close']);

const tokenValue = ref(props.token.value);
const addressesValue = ref(props.addresses);
const currentWallet = ref(props.addresses && props.addresses.length ? props.addresses[0].id : 0);
const addressModel = ref('');
const isAddInputActive = ref(false);
const isAddressValid = ref(false);

const balancePropRef = toRef(props, 'token');
const addressesPropRef = toRef(props, 'addresses');

watch(
  balancePropRef,
  (value) => {
    if (value) {
      tokenValue.value = value.value;
    }
  },
  { deep: true },
);

const checkIsAddressesValid = (options) => {
  if (!options) return null;
  if (
    props.token.typeOfChain === TYPE_OF_CHAIN.EVM &&
    options.some((item) => ethers.utils.isAddress(item.address))
  ) {
    return options.find((item) => ethers.utils.isAddress(item.address));
  } else if (
    props.token.typeOfChain === TYPE_OF_CHAIN.TRON &&
    options.some((item) => isValidTronAddress(item.address))
  ) {
    return options.find((item) => isValidTronAddress(item.address));
  } else if (
    props.token.typeOfChain === TYPE_OF_CHAIN.APTOS &&
    options.some((item) => isValidAptosAddress(item.address))
  ) {
    return options.find((item) => isValidAptosAddress(item.address));
  } else if (
    props.token.typeOfChain === TYPE_OF_CHAIN.SEI &&
    options.some((item) => isValidSeiAddress(item.address))
  ) {
    return options.find((item) => isValidSeiAddress(item.address));
  } else return null;
};

watch(
  addressesPropRef,
  (value) => {
    if (value) {
      addressesValue.value = value;
      if (checkIsDefaultAddressValid(value)) {
        currentWallet.value = checkIsAddressesValid(value).id;
      }
    }
  },
  { deep: true },
);

const checkIsDefaultAddressValid = (options) => {
  if (!options) return false;
  if (
    props.token.typeOfChain === TYPE_OF_CHAIN.EVM &&
    options.some((item) => ethers.utils.isAddress(item.address))
  ) {
    return true;
  } else if (
    props.token.typeOfChain === TYPE_OF_CHAIN.TRON &&
    options.some((item) => isValidTronAddress(item.address))
  ) {
    return true;
  } else if (
    props.token.typeOfChain === TYPE_OF_CHAIN.APTOS &&
    options.some((item) => isValidAptosAddress(item.address))
  ) {
    return true;
  } else if (
    props.token.typeOfChain === TYPE_OF_CHAIN.SEI &&
    options.some((item) => isValidSeiAddress(item.address))
  ) {
    return true;
  } else return false;
};

const blockChainOptions = computed(() => [...blockchainsStore.getBlockchains]);
const isClaimBtnActive = computed(
  () => {
    return (
      !props.addresses ||
      (props.addresses && !props.addresses.length) ||
      !tokenValue.value ||
      !checkIsDefaultAddressValid(props.addresses) ||
      tokenValue.value < 0.00001
    );
  },
  { deep: true, instant: true },
);

watch(
  addressModel,
  (value) => {
    if (props.token.typeOfChain === TYPE_OF_CHAIN.EVM) {
      if (value && ethers.utils.isAddress(value)) {
        isAddressValid.value = true;
      } else {
        isAddressValid.value = false;
      }
    } else if (props.token.typeOfChain === TYPE_OF_CHAIN.TRON) {
      if (isValidTronAddress(value)) {
        isAddressValid.value = true;
      } else {
        isAddressValid.value = false;
      }
    } else if (props.token.typeOfChain === TYPE_OF_CHAIN.APTOS) {
      if (isValidAptosAddress(value)) {
        isAddressValid.value = true;
      } else {
        isAddressValid.value = false;
      }
    } else if (props.token.typeOfChain === TYPE_OF_CHAIN.SEI) {
      if (isValidSeiAddress(value)) {
        isAddressValid.value = true;
      } else {
        isAddressValid.value = false;
      }
    }
  },
  { deep: true, instant: true },
);

const handleAddAddress = async () => {
  if (!addressModel.value || !addressModel.value.length) return;
  if (props.token.typeOfChain === TYPE_OF_CHAIN.EVM) {
    if (addressModel.value && !ethers.utils.isAddress(addressModel.value)) {
      return;
    }
  } else if (props.token.typeOfChain === TYPE_OF_CHAIN.TRON) {
    if (addressModel.value && !isValidTronAddress(addressModel.value)) {
      return;
    }
  } else if (props.token.typeOfChain === TYPE_OF_CHAIN.APTOS) {
    if (addressModel.value && !isValidAptosAddress(addressModel.value)) {
      return;
    }
  } else if (props.token.typeOfChain === TYPE_OF_CHAIN.SEI) {
    if (addressModel.value && !isValidSeiAddress(addressModel.value)) {
      return;
    }
  }
  try {
    await addressStore.setAddressAction({ address: addressModel.value });
    await addressStore.getAddressesAction();
    isAddInputActive.value = false;
    addressModel.value = '';
    isAddressValid.value = false;
    nuxtApp.$alert.show('Address added', {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    isAddInputActive.value = false;
    addressModel.value = '';
    isAddressValid.value = false;
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });

    console.log('error', error);
  }
};

const setAddress = (event) => {
  console.log('setAddress event', event);
  if (event && event.id) {
    currentWallet.value = event.id;
  }
};

const handleClaim = async () => {
  if (isClaimBtnActive.value) return;
  try {
    await innerWalletStore.claimTokensAction({
      value: tokenValue.value,
      user_project_wallet_id: props.token.walletId,
      user_wallet_address_id: currentWallet.value,
    });
    innerWalletStore.getInnerWalletOverviewAction();
    innerWalletStore.getInnerWalletHistoryAction();
    innerWalletStore.getProjectPaymentsAction({ project_id: null });
    // innerWalletStore.getWithdrawalRequestsAction();
    await innerWalletStore.getWithdrawalRequestsAction({ page: 1 });
    await addressStore.getAddressesAction();
    nuxtApp.$alert.show('Claim sent', {
      type: 'success',
      timeout: 5000,
    });

    window.dataLayer.push({
      event: 'talent_reward_claim',
    });

    emit('close');
  } catch (error) {
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
    console.log('handleClaim error', error);
    emit('close');
  }
};
</script>

<style lang="scss" scoped>
.add-address-input {
  input {
    &::placeholder {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
    }
  }
}
.add-address-btn_wrapper {
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.add-address-input {
  position: relative;
  width: 100%;
  input {
    width: 100%;
    padding: 4px 8px;
    border-radius: 8px;
    border: 1px solid #aaa7cc;
    background: #fff;
    outline: none;

    color: $default;
    font-size: 14px;
    font-family: Basis Grotesque Pro;
    font-weight: 500;
    line-height: 20px;
  }
}
.withdraw-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 24px;
  &-section {
    width: 100%;
    &-title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $section-title;
      margin-bottom: 5px;
    }
    &-subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $secondary;
      margin-bottom: 5px;
    }
  }
  &-amout {
    &-info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
      padding: 0 5px;

      span {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        display: flex;
        align-items: center;
        text-align: right;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $secondary;
      }
    }
  }
  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
}
</style>
