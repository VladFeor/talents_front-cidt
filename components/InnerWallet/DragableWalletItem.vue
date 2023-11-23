<template>
  <div
    class="drag-item"
    @mouseover="isHovered = true"
    @mouseleave="
      isHovered = false;
      isTooltipActive = false;
    "
  >
    <div class="address_wrapper">
      <img class="wallet-icon" :src="getCurrentWalletIcon(type)" alt="" />
      <span>{{ shortenAddress(address) }}</span>
      <Icon
        v-if="isHovered"
        @click="copyAddress(address)"
        class="copy-icon"
        name="Copy"
        :size="24"
      />
    </div>
    <!-- <Icon v-if="isPrimary" icon="Star-0" :size="24"></Icon> -->
    <img v-if="isPrimary" :src="pin" alt="" />

    <div class="more_wrapper">
      <div v-if="isHovered" @click="handleTooltip" class="more_btn">
        <Icon icon="More" :size="24"></Icon>
      </div>
    </div>
    <div v-if="isTooltipActive" id="tooltip-transaction-btn">
      <div class="tooltip-arrow"></div>
      <div class="menu">
        <div class="link" @click="setPrimaryAddress(id)">
          {{ isPrimary ? 'Unset as Primary' : 'Set as Primary' }}
        </div>
        <div
          v-if="walletsAddresses && walletsAddresses.length > 1 && !isPrimary"
          class="link red"
          @click="deleteAddAddress(id, walletsAddresses)"
        >
          Delete Address...
        </div>
      </div>
    </div>
    <div v-if="isCopyTooltipActive" id="tooltip-copied">
      <div class="tooltip-arrow"></div>
      <div class="menu">
        <div class="text">Copied to clipboard</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { shortenAddress } from '@/util/web3';
import { useUserStore } from '~/store';
import { useAddressStore } from '~/store/address';
import { getCurrentWalletIcon } from '~/util/web3';
import { pin } from '@/constants/icons';

const nuxtApp = useNuxtApp();

const addressStore = useAddressStore();
const walletsAddresses = computed(() => addressStore.getAddresses);

const props = defineProps({
  address: { type: String, default: '' },
  type: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
  id: { type: Number, default: false },
});

const isHovered = ref(false);
const isTooltipActive = ref(false);
const isCopyTooltipActive = ref(false);

const handleTooltip = () => {
  isTooltipActive.value = !isTooltipActive.value;
};

const setPrimaryAddress = async (address) => {
  try {
    await addressStore.setPrimaryAddressAction(address);
    await addressStore.getAddressesAction();
    await useUserStore().userInfo();
    nuxtApp.$alert.show('Address has been changed', {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    console.log('error', error);
  }
};

const deleteAddAddress = async (id, addresses) => {
  if (addresses && addresses.length <= 1) return;
  try {
    // const isPrimaryDeleting = addresses.find((item) => item.id === id).isPrimary;
    await addressStore.deleteAddressesAction(id);
    // if (isPrimaryDeleting) {
    //   const currentAddresses = await addressStore.getAddressesAction();
    //   await setPrimaryAddress(currentAddresses[0]);
    // } else {
    await addressStore.getAddressesAction();
    // }
    await useUserStore().userInfo();
    nuxtApp.$alert.show('Address has been deleted', {
      type: 'success',
      timeout: 5000,
    });
  } catch (error) {
    console.log('error', error);
  }
};

const copyAddress = async (address) => {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(address);
      isCopyTooltipActive.value = true;
      setTimeout(() => {
        isCopyTooltipActive.value = false;
      }, 800);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  } else {
    unsecuredCopyToClipboard(address);
  }
};

const unsecuredCopyToClipboard = (address) => {
  const textArea = document.createElement('textarea');
  textArea.value = address;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');

  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    isCopyTooltipActive.value = true;
    window.scrollTo(0, 0);
    setTimeout(() => {
      isCopyTooltipActive.value = false;
    }, 800);
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  } finally {
    document.body.removeChild(textArea);
  }
};
</script>

<style lang="scss" scoped>
.wallet-icon {
  width: 24px;
  height: 24px;
}
.drag-item {
  display: flex;
  justify-content: space-between;
  cursor: move;
  position: relative;
  .address_wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      color: $section-title;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: Basis Grotesque Pro;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }
  }

  .more_wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 22px;

    .more_btn {
      color: $default;
    }
  }

  border-radius: 8px;
  border: 1px solid $default-border;
  padding: 7px 12px;
  cursor: pointer;

  &:hover {
    background-color: $default-border;
  }
}
.copy-icon {
  // filter: invert(81%) sepia(7%) saturate(1243%) hue-rotate(205deg) brightness(84%) contrast(88%);
  filter: invert(78%) sepia(28%) saturate(358%) hue-rotate(205deg) brightness(85%) contrast(85%);
}
#tooltip-transaction-btn {
  position: absolute;
  height: fit-content;
  margin-top: 6%;
  background: $white;
  top: 5px;
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
  z-index: 9999999;
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
    // .red {
    //   color: $red !important;
    // }
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
      &.red-bg {
        color: $red !important;

        &:hover {
          background: #ffe4e0;
          cursor: pointer;
        }
      }
    }
  }
}
#tooltip-copied {
  position: absolute;
  background: $white;
  top: 40px;
  left: 140px;
  padding: 4px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  z-index: 9999999;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 52%;
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
    // .red {
    //   color: $red !important;
    // }
    .text {
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
    }
  }
}
</style>
