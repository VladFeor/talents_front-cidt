<template>
  <div class="balance">
    <div class="title"><span>Current Balance</span> <TooltipIcon tooltipText="Total earnings on the platform" /></div>
    <div class="amount" :class="{ 'empty-balance': balance == 0 }">~{{ balance }} USDT</div>
    <ButtonDark text="Inner Wallet" icon="Wallet" @click="toWallet"> </ButtonDark>
  </div>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const toWallet = () => {
  router.push('/inner-wallet');
};

const balance = computed(() => {
  let num = userStore.getUser.total_balance;
  let splitNum = num.toString().split('.');
  if (splitNum[1] && splitNum[1].length > 4) {
    return parseFloat(num.toFixed(4));
  } else {
    return num;
  }
});
</script>

<style scoped lang="scss">
.balance {
  width: 360px;
  height: 184px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  font-family: 'Basis Grotesque Pro';
  .title {
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
  .amount {
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
  .empty-balance {
    color: $secondary;
  }
}
</style>
