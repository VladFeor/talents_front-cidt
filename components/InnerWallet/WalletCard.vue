<template>
  <div class="wallet-card" :class="{ [type]: !!type }">
    <div class="wallet-card_header">
      <span class="wallet-card_title" :class="{ amount: type === 'amount' }">{{ title }}</span>
      <div
        @click="handleDropdown"
        ref="menu"
        class="wallet-card_wrapper-icon"
        :class="{ [type]: type, [type + '-active']: isActiveDropdown }"
      >
        <Icon
          v-if="type !== 'transparent'"
          class="wallet-card_icon"
          :class="{ [type]: !!type }"
          :name="type === 'earn' ? 'Share' : 'Wallet'"
          :size="24"
        />
        <div v-if="isActiveDropdown" id="dropdown-wallet-card">
          <div class="tooltip-arrow" :class="{ amount: type === 'amount' }"></div>
          <div class="menu">
            <div class="amount-dropdown" v-if="type === 'amount'">
              <span @click="isManageModalOpen = true">Manage Addresses</span>
            </div>
            <div v-if="type === 'earn'">
              <div class="wallet-social-links">
                <div class="wallet-social-link">
                  <Icon name="Telegram-Default" :size="24" /> <span>Telegram</span>
                </div>
                <div class="wallet-social-link">
                  <Icon name="Twitter-Default" :size="24" /><span>Twitter</span>
                </div>
                <div class="wallet-social-link">
                  <Icon name="Discord-Default" :size="24" /> <span>Discord</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wallet-card_body">
      <span class="wallet-card_summ" :class="{ amount: type === 'amount' }"
        >~{{ walletAmount }}</span
      >
      <span class="wallet-card_summ" :class="{ amount: type === 'amount' }">{{ currency }}</span>
    </div>
  </div>
  <BaseModal
    :width="480"
    :top="150"
    @close="handleCloseManage($event)"
    :visible="isManageModalOpen"
    isScrollOff
    isBlockOverflow
  >
    <ConnectedAddressesModal @close="handleCloseManage(false)" />
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import { shortenAddress } from '@/util/web3';
import { formatNumberMore10K, reduceStringLength } from '@/util/helpers';
// import bgImage from '@/assets/images/connect-wallet-bg.svg';

const nuxtApp = useNuxtApp();

const isActiveDropdown = ref(false);
const isManageModalOpen = ref(false);
const menu = ref(null);
// const isActiveEarnDropdown = ref(false);

const props = defineProps({
  title: { type: String, default: '' },
  amount: { type: String, default: '' },
  currency: { type: String, default: '' },
  type: { type: String, default: '' },
});

const isConnected = ref(true);
const address = ref('0x91Bbc2A6C3C7006e26Cd1CF6e27B0FeBA94377cE');

const handleCloseManage = (event) => {
  isManageModalOpen.value = event;
};

const walletAmount = computed(() =>
  formatNumberMore10K(
    String(props.amount).includes('.') ? Number(props.amount).toFixed(4) : props.amount,
  ),
);

const handleDropdown = () => {
  if (props.type === 'transparent') return;
  isActiveDropdown.value = true;

  // if (props.type === 'amount') {
  //   isActiveManageDropdown.value = true;
  // } else if (props.type === 'earn') {
  //   isActiveEarnDropdown.value = true;
  // }
};

const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    isActiveDropdown.value = false;
    // isActiveEarnDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

const copy = async (link) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(address.value);
    nuxtApp.$alert.show('Address copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } else {
    unsecuredCopyToClipboard(address.value);
  }
};

const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');

  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    nuxtApp.$alert.show('Address copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
};
</script>

<style lang="scss" scoped>
.wallet-social-links_title {
  color: $secondary;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.168px;
  padding-left: 8px;
  padding-top: 8px;
}
.amount-dropdown {
  white-space: nowrap;
  padding: 6px 8px;
  &:hover {
    span {
      background-color: $default-badge-border;
      border-radius: 8px;
    }
  }
  span {
    display: block;
    padding: 7px 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
    &:hover {
      background-color: $default-badge-border;
      border-radius: 8px;
    }
  }
}
.wallet-social-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  .wallet-social-link {
    width: 112px;
    height: 32px;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 4px 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
    &:hover {
      background-color: $default-badge-border;
      border-radius: 8px;
    }
  }
}
#dropdown-wallet-card {
  position: absolute;
  z-index: 220000;
  right: -18px;
  width: auto;
  height: fit-content;
  margin-top: 15px;
  background: $white;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .tooltip-arrow {
    position: absolute;
    top: -6px;
    left: 73%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $white;
    &.amount {
      left: 78%;
    }
  }
  .menu {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 8px;
    .link {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $default;
    }
    .logout {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      font-feature-settings: 'zero' on;
      color: $secondary;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    hr {
      color: $default-border;
    }
  }
}
.wallet-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-repeat: no-repeat;
  background-size: cover;
  width: 376px;
  height: 120px;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  &_summ {
    color: $default;
    &.amount {
      color: $white;
    }
  }
  &_title {
    color: $default;
    font-size: 12px;
    &.amount {
      color: $white;
    }
  }
  &_wrapper-icon {
    padding: 4px;
    border-radius: 8px;

    position: relative;
    &.amount {
      &:hover {
        background: $orange;
      }
      &-active {
        background: $orange;
      }
    }

    &.earn {
      &:hover {
        background: $default-border;
      }
      &-active {
        background: $default-border;
      }
    }
  }
  &_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &_body {
    display: flex;
    gap: 8px;
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      font-feature-settings: 'zero';
    }
  }
  &.amount {
    background-image: url('@/assets/images/wallet-bg.svg') !important;
    &_header {
      color: $white !important;
    }
    &_body {
      color: $white !important;
      span {
        color: $white !important;
      }
    }
  }
  &.earn {
    color: $default;
    background-image: url('@/assets/images/earn-bg.svg') !important;
  }
  &.transparent {
    color: $default;
    background: $white;
    background-image: none;
  }
  &_icon {
    filter: invert(99%) sepia(4%) saturate(152%) hue-rotate(264deg) brightness(371%) contrast(100%);
    &.transparent,
    &.earn {
      filter: invert(0%) sepia(94%) saturate(0%) hue-rotate(196deg) brightness(97%) contrast(105%);
    }
  }
}
</style>
