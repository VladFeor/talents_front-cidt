<template>
  <div class="wallet">
    <div class="wallet-amount">
      <Icon name="USDT-Circle" :size="24" class="mr-1" />
      <div class="wallet-balance">{{ balance }}<span class="token-symbol ml-1">USDT</span></div>
    </div>
    <div class="wallet-btn" @click="handleCloseConnectModal(true)">{{ wallet }}</div>
  </div>
  <BaseModal :width="480" @close="handleCloseConnectModal($event)" :visible="isShowConnectModal">
    <ConnectWalletModal @close="isShowConnectModal = false" />
  </BaseModal>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { computed } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const nuxtApp = useNuxtApp();
const userStore = useUserStore();
const authStore = useAuthStore();

const currentAccount = ref(null);
const signature = ref(null);
const isShowConnectModal = ref(false);

const wallet = computed(() =>
  userStore.getUser?.wallet
    ? userStore.getUser.wallet.substr(-42, 5) + '...' + userStore.getUser.wallet.substr(-4, 4)
    : 'Connect Wallet',
);

const walletAddress = computed(() => userStore.getWallet);

watch(
  () => walletAddress.value,
  (value) => {
    console.log('WATCH walletAddress', value);
  },
  { deep: true, instant: true },
);

const balance = computed(() => {
  let num = userStore.getUser?.total_balance;
  if (num) {
    let splitNum = num.toString().split('.');
    if (splitNum[1] && splitNum[1].length > 4) {
      return parseFloat(num.toFixed(4));
    } else {
      return num;
    }
  } else return 0;
});

const handleCloseConnectModal = (event) => {
  if (userStore.getUser?.wallet) return;
  isShowConnectModal.value = event;
};
</script>

<style lang="scss" scoped>
.wallet {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 4px 4px 16px;
  gap: 12px;
  width: fit-content;
  height: 40px;
  background: $default-badge-border;
  border-radius: 8px;
  &-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 8px;
    padding-top: 6px;
    gap: 4px;
    max-width: 115px;
    height: 32px;
    background: linear-gradient(84.69deg, #fc660c 0%, rgba(252, 102, 12, 0) 100%), #ff9844;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $white;
  }
  &-amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-balance {
    margin-top: 4px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }
}
</style>
