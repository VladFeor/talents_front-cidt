<template>
  <div class="amount">
    <Icon
      v-for="currency in currencies"
      :key="currency"
      :name="getCuttencyIcon(currency.toLowerCase())"
      :size="24"
    />
  </div>
</template>

<script>
import bnbIcon from '@/assets/icons/tokens/bnb.svg';
export default {
  name: 'Amount',
  data() {
    return {
      bnbIcon,
    };
  },
  props: {
    amount: {
      type: String,
      default: '',
    },
    currencies: { type: Array, default: ['Ethereum1', 'BNB1', 'RenBTC1'] },
  },
  methods: {
    getCuttencyIcon(currency) {
      switch (currency) {
        case 'eth':
          return 'Ethereum1';
        case 'bnb':
          return 'BNB1';
        case 'btc':
          return 'RenBTC1';
        case 'cplt':
          return 'USDT-Circle';
        case 'discord':
          return 'Discord-Circle';
        default:
          return 'USDD-Default';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.amount {
  display: flex;
  align-items: center;
  gap: 14px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  .img {
    background: $default-bg;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 40px;
  }
}
</style>
