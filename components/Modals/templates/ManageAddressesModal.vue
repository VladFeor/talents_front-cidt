<template>
  <div class="manage-modal">
    <div class="manage-modal_title">Manage Addresses</div>
    <div class="manage-modal_subtitle">
      <span>Add new addresses to withdraw earnings </span>
      <span>and remove unused ones.</span>
    </div>
    <div
      v-if="
        walletsAddresses &&
        walletsAddresses.length &&
        walletsAddresses.some((item) => item.is_primary)
      "
      class="primary_address_wrapper"
    >
      <div class="primary_address">
        <span>{{
          reduceStringLength(walletsAddresses.find((item) => item.is_primary).address, 50)
        }}</span>
      </div>
      <div class="primary_address-title">
        This address is used for authorization and cannot be deleted.
      </div>
    </div>
    <div v-if="walletsAddresses && walletsAddresses.length" class="manage-modal_addresses_wrapper">
      <AddressBadge
        v-for="address in walletsAddresses"
        :key="address.address"
        :address="address"
        :addressId="address.id"
        :delete="deleteAddAddress"
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
      <AddAddressBtn @click="isAddInputActive = true" />
    </div>

    <BaseButton
      class="mt-7"
      text="Done"
      type="normal"
      @click="handleAddAddress"
      :disabled="!isAddressValid ? true : false"
    />
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

const userStore = useUserStore();

const nuxtApp = useNuxtApp();

onMounted(() => {
  addressStore.getAddressesAction();
});

const emit = defineEmits(['close']);

const addressModel = ref('');
const isAddInputActive = ref(false);
const isAddressValid = ref(false);

const addressStore = useAddressStore();

const wallet = computed(() => (userStore.getUser?.wallet ? userStore.getUser.wallet : ''));
const walletsAddresses = computed(() => addressStore.getAddresses);

watch(
  addressModel,
  (value) => {
    if (
      (value && ethers.utils.isAddress(value)) ||
      (value && isValidTronAddress(value)) ||
      (value && isValidAptosAddress(value)) ||
      (value && isValidSeiAddress(value))
    ) {
      isAddressValid.value = true;
    } else {
      isAddressValid.value = false;
    }
  },
  { deep: true, instant: true },
);

const handleAddAddress = async () => {
  if (
    (addressModel.value && ethers.utils.isAddress(addressModel.value)) ||
    (addressModel.value && isValidTronAddress(addressModel.value)) ||
    (addressModel.value && isValidAptosAddress(addressModel.value)) ||
    (addressModel.value && isValidSeiAddress(addressModel.value))
  ) {
    try {
      await addressStore.setAddressAction(addressModel.value);
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
  }
};
const deleteAddAddress = async (id) => {
  try {
    await addressStore.deleteAddressesAction(id);
    await addressStore.getAddressesAction();
    isAddInputActive.value = false;
    nuxtApp.$alert.show('Address was deleted', {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    isAddInputActive.value = false;
    console.log('error', error);
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
.primary_address {
  width: 100%;
  display: flex;
  width: 416px;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;

  border-radius: 8px;
  border: 1px solid #ff9844;
  background: #f5f5fd;

  &_wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  span {
    color: #fc660c;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }

  &-title {
    color: #6a6d8f;
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.168px;
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
.manage-modal {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_user-wallet {
    width: 100%;
    display: flex;
    width: 416px;
    padding: 4px 8px;
    align-items: center;
    gap: 8px;

    border-radius: 8px;
    border: 1px solid #ff9844;
    background: #f5f5fd;

    &_wrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    span {
      color: #fc660c;
      font-family: Basis Grotesque Pro;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px;
    }

    &-title {
      color: #6a6d8f;
      font-family: Basis Grotesque Pro;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px; /* 133.333% */
      letter-spacing: 0.168px;
    }
  }
  &_add_wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    &.zero {
      justify-content: center;
    }
  }
  &_addresses_wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 150px;
    overflow: auto;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  &_subtitle {
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      text-align: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $section-title;
    }
  }
}
</style>
