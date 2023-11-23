<template>
  <div class="wallet_addresses">
    <div class="wallet_addresses-header">
      <div class="wallet_addresses_title">
        <span>Wallet Addresses</span>
        <TooltipIcon
          tooltipText="You can connect up to 10 addresses. The primary address will be used for login."
        />
      </div>
      <!-- <span class="arrow" :class="{ flipped: open }"></span> -->
      <img
        class="arrow"
        :class="{ flipped: open }"
        src="@/assets/images/select.svg"
        alt=""
        @click="open = !open"
      />
    </div>

    <div v-if="currentWallets && currentWallets.length" class="drag_wrapper" :class="{ open }">
      <DragableWalletItemProfile
        v-if="currentWallets.some((item) => item.is_primary)"
        style="margin-bottom: 8px"
        isPrimary
        :address="currentWallets.find((item) => item.is_primary).address"
        :id="currentWallets.find((item) => item.is_primary).id"
        :type="currentWallets.find((item) => item.is_primary).type"
      />
      <draggable
        v-model="currentWallets"
        class="drag-container"
        tag="div"
        ghost-class="ghost"
        @start="dragging = false"
        @end="
          dragging = true;
          checkMove();
        "
      >
        <template #item="{ element: wallet }">
          <div v-if="!wallet.is_primary">
            <DragableWalletItemProfile
              :address="wallet.address"
              :id="wallet.id"
              :type="wallet.type"
            />
          </div>
        </template>
      </draggable>
    </div>

    <div v-else class="empty-list-addresses">
      <icon icon="icons8-futurama-amy-wong" :size="48"></icon>
      <span>You haven't added any addresses yet</span>
    </div>

    <div
      v-if="open"
      class="wallet_addresses_add_wrapper"
      :class="{ zero: walletsAddresses && !walletsAddresses.length }"
    >
      <NewAddAddressBtn title="Add Address" isBorder />
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
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { shortenAddress } from '@/util/web3';

const userStore = useUserStore();

const nuxtApp = useNuxtApp();

onMounted(() => {
  addressStore.getAddressesAction();

  const items = document.querySelectorAll('li');

  items.forEach((item) => {
    item.addEventListener('dragstart', () => {
      item.classList.add('dragging'); // Apply the dragging class
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging'); // Remove the dragging class
    });
  });
});

const emit = defineEmits(['close']);

const isAddressValid = ref(false);
const dragging = ref(false);
const open = ref(true);

const addressStore = useAddressStore();

const wallet = computed(() => (userStore.getUser?.wallet ? userStore.getUser.wallet : ''));
const walletsAddresses = computed(() => addressStore.getAddresses);
const currentWallets = ref(walletsAddresses.value);

watch(
  () => walletsAddresses.value,
  (value) => {
    currentWallets.value = value;
  },
  { deep: true, instant: true },
);

const checkMove = async () => {
  try {
    const rows = currentWallets.value.map((item, index) => ({
      id: item.id,
      position: item.position,
    }));
    await addressStore.setOrderAddressesAction(rows);
    // nuxtApp.$alert.show('Order has been changed', {
    //   type: 'success',
    //   timeout: 5000,
    // });
  } catch (error) {
    nuxtApp.$alert.show(error, {
      type: 'error',
      timeout: 5000,
    });
  }
};

const handleMove = (event) => {
  console.log('handleMove event', event);
};
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0.5;
  background: $white;
}
.drag_wrapper {
  width: 100%;
  max-height: 0px;
  overflow: hidden;
  &.open {
    max-height: fit-content;
    overflow: visible;
  }
  .drag-container {
    list-style-type: '';
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
.dragging {
  cursor: grabbing; /* Change cursor to a hand when li is being dragged */
}
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
.wallet_addresses {
  width: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  gap: 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
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
  }
  &_title {
    display: flex;
    align-items: center;
    span {
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $secondary;
      margin-right: 10px;
    }
  }
}
.arrow {
  //   position: absolute;
  //   content: '';
  //   top: 12px;
  //   right: 1em;
  display: block;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
  cursor: pointer;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
}

.arrow.flipped {
  transform: rotate(180deg);
}

.empty-list-addresses {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  * {
    margin: auto;
  }
  span {
    display: block;
    margin-top: 15px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #aaa7cc;
  }
}
</style>
