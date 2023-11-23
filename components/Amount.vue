<template>
  <div class="amount">
    <img
      class="credits-img"
      v-if="rewardString && rewardString.includes('Credits')"
      src="@/assets/icons/Credits.svg"
      alt=""
    />
    <Coin v-else :name="currency.toUpperCase() + '-Default'" :size="26" />
    <span v-if="rewardString">{{ reduceStringLength(rewardString, 13) }} </span>
    <MoreBtn
      :data="transformedRewardsData"
      v-if="
        rewards && rewards.length > 1 && transformedRewardsData && transformedRewardsData.length
      "
    />
  </div>
</template>

<script>
import bnbIcon from '@/assets/icons/tokens/bnb.svg';
import creditsIcon from '@/assets/icons/Credits.svg';
import { reduceStringLength } from '@/util/helpers';
import axios from 'axios';
import { useDiscordStore } from '~/store/discord';
export default {
  name: 'Amount',
  data() {
    return {
      reduceStringLength,
      bnbIcon,
      rewardString: '',
      icon: 'USDT-Circle',
      transformedRewardsData: null,
    };
  },
  props: {
    amount: {
      type: String,
      default: '',
    },
    currency: { type: String, default: '' },
    projectId: { type: Number, default: null },
    isMoreBtn: { type: Boolean, default: false },
    rewards: { type: Array, default: [] },
  },
  async mounted() {
    if (this.rewards && this.rewards.length) {
      const isCoinsExist = this.rewards.find((reward) => reward.type === 'coins');
      const isCreditsExist = this.rewards.find((reward) => reward.type === 'credits');
      const isDiscordExist = this.rewards.find((reward) => reward.type === 'discord_role');
      if (isCoinsExist) {
        this.icon = this.getCuttencyIcon(this.currency);
        this.rewardString = `${isCoinsExist.value} ${this.currency.toUpperCase()}`;
      } else if (isCreditsExist) {
        this.icon = creditsIcon;
        this.rewardString = `${isCreditsExist.value} Credits`;
      } else if (isDiscordExist) {
        this.icon = 'Discord-Circle';
        const discordData = await useDiscordStore().getDiscordRoleAction(this.projectId);
        const currentDiscordReward = discordData.find((item) => item.id === isDiscordExist.value);
        this.rewardString = `${currentDiscordReward.name}`;
      }
      // else {
      //   this.rewardString = `${rewards[0].value} ${this.currency.toUpperCase()}`;
      // }

      if (this.rewards.length > 1 && isDiscordExist && isCreditsExist) {
        const discordData = await useDiscordStore().getDiscordRoleAction(this.projectId);
        const currentDiscordReward = discordData.find((item) => item.id === isDiscordExist.value);
        this.transformedRewardsData = [
          currentDiscordReward.name,
          this.currency.toUpperCase(),
          `${isCreditsExist.value} Credits`,
        ];
      }

      if (this.rewards.length > 1 && isDiscordExist && !isCreditsExist) {
        const discordData = await useDiscordStore().getDiscordRoleAction(this.projectId);
        const currentDiscordReward = discordData.find((item) => item.id === isDiscordExist.value);
        this.transformedRewardsData = [currentDiscordReward.name, this.currency.toUpperCase()];
      }
      if (this.rewards.length > 1 && isCreditsExist && !isDiscordExist) {
        this.transformedRewardsData = [`${isCreditsExist.value} Credits`];
      }
    }
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
        // case 'cplt':
        //   return 'USDT-Circle';
        case 'busd':
          return 'Binance-USD1';
        default:
          return 'USDD-Default';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.credits-img {
  width: 26px;
  height: 26px;
}
.amount {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
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
