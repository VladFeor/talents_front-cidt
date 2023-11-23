<template>
  <div class="enter-address-modal">
    <div class="enter-address-modal_title">Manual Addition of Address</div>
    <FilterToggle
      :buttons="[
        { title: '0x', id: 0 },
        { title: 'Tron', id: 1 },
        { title: 'Sei', id: 2 },
        { title: 'Aptos', id: 3 },
      ]"
      :id="0"
      @select="setActiveBlockchainBtn($event)"
      btnLight
      isFluid
    />
    <div class="blockchain-icons">
      <div class="icon-wrapper" v-for="item in icons[activeBlockchain]" :key="item">
        <Icon :name="`${item}`" :size="24" />
      </div>
    </div>
    <div class="input_wrapper">
      <Input
        v-model="addressValue"
        @input="addressValidation"
        name=""
        :placeholder="getBlockchainPlaceholder(activeBlockchain)"
      />
      <div v-if="isErrorActive" class="wallet-error">
        {{
          addressValue.length
            ? `Enter ${getBlockchainName(activeBlockchain)} address`
            : 'Wallet address is required'
        }}
      </div>
    </div>
    <div class="enter-address-modal_btns">
      <BaseButton text="Cancel" type="secondary" @click="emit('close')" />
      <BaseButton text="Add" type="normal" @click="handleAddAddress" />
    </div>
  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useAddressStore } from '~/store/address';
import { useUserStore } from '~/store/user';
import { isValidSeiAddress } from '@sei-js/core';
import { isValidTronAddress, isValidAptosAddress } from '~/web3/helpers';
import { reduceStringLength } from '@/util/helpers';
import { ConnectionType } from '~/web3/connection';

const nuxtApp = useNuxtApp();

const addressStore = useAddressStore();

const emit = defineEmits(['close']);

const addressValue = ref('');
const isTelegramValid = ref(true);
const activeBlockchain = ref(0);

const isErrorActive = computed(() => {
  if (isTelegramValid.value === false) return true;
  else return false;
});

const icons = {
  0: ['Ethereum-Default', 'BSC', 'Optimism-Default', 'Polygon-Default'],
  1: ['Tron-Default'],
  2: ['SEI-Default'],
  3: ['Aptos'],
};

const getBlockchainName = (id) => {
  switch (id) {
    case 0:
      return 'EVM';
    case 1:
      return 'Tron';
    case 2:
      return 'Sei';
    case 3:
      return 'Aptos';

    default:
      break;
  }
};

const getBlockchainType = (id) => {
  switch (id) {
    case 0:
      return 'UNKNOWN';
    case 1:
      return ConnectionType.TRONLINK;
    case 2:
      return ConnectionType.COMPASS;
    case 3:
      return ConnectionType.APTOS_PETRA;

    default:
      return 'UNKNOWN';
  }
};

const handleAddAddress = async () => {
  if (addressValue.value && addressValue.value.length && isTelegramValid.value) {
    console.log(
      'getBlockchainType(activeBlockchain.value)',
      getBlockchainType(activeBlockchain.value),
    );
    try {
      await addressStore.setAddressAction({
        address: addressValue.value,
        type: getBlockchainType(activeBlockchain.value),
      });
      await addressStore.getAddressesAction();
      addressValue.value = '';
      nuxtApp.$alert.show('Address added', {
        type: 'success',
        timeout: 5000,
      });
      emit('close');
    } catch (error) {
      addressValue.value = '';
      nuxtApp.$alert.show(error, {
        type: 'error',
        timeout: 5000,
      });
      emit('close');

      console.log('error', error);
    }
  }
};

const addressValidation = () => {
  if (!addressValue.value.trim()) {
    isTelegramValid.value = false;
  } else if (
    activeBlockchain.value === 0 &&
    addressValue.value &&
    !ethers.utils.isAddress(addressValue.value)
  ) {
    isTelegramValid.value = false;
  } else if (
    activeBlockchain.value === 1 &&
    addressValue.value &&
    !isValidTronAddress(addressValue.value)
  ) {
    isTelegramValid.value = false;
  } else if (
    activeBlockchain.value === 2 &&
    addressValue.value &&
    !isValidSeiAddress(addressValue.value)
  ) {
    isTelegramValid.value = false;
  } else if (
    activeBlockchain.value === 3 &&
    addressValue.value &&
    !isValidAptosAddress(addressValue.value)
  ) {
    isTelegramValid.value = false;
  } else {
    isTelegramValid.value = true;
  }
};

watch(
  () => isTelegramValid.value,
  (value) => {
    console.log('isTelegramValid.value', value);
  },
);

const setActiveBlockchainBtn = (event) => {
  activeBlockchain.value = event.id;
  addressValidation();
};

const getBlockchainPlaceholder = (id) => {
  switch (id) {
    case 0:
      return '0x';
    case 1:
      return 'Enter address starting with tron';
    case 2:
      return 'Enter address starting with sei';
    case 3:
      return 'Enter aptos address';

    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.input_wrapper {
  position: relative;
}
.wallet-error {
  position: absolute;
  right: 0;
  bottom: -15px;
  border-radius: 6px;
  background-color: #eb6854;
  padding: 4px 8px;

  color: $white;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.168px;
}
.blockchain-icons {
  display: flex;
  justify-content: center;
}
.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.enter-address-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  &_title {
    text-align: center;
    color: #1a1d29;
    font-variant-numeric: slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 166.667% */
  }
  &_btns {
    display: flex;
    gap: 24px;
  }
}
</style>
