<template>
  <div class="rewards" v-if="rewardsArray.length">
    <div v-for="taskReward in rewardsArray" :key="taskReward.rewardString" class="reward">
      <img v-if="taskReward.type === 'credits'" :src="taskReward.icon" alt="" />
      <Coin
        v-if="taskReward.type === 'coin'"
        :name="currency.toUpperCase() + '-Default'"
        :size="26"
      />
      <Icon v-if="taskReward.type === 'discord'" :name="taskReward.icon" :size="26" />
      <span>{{ taskReward.rewardString }}</span>
    </div>
  </div>
</template>

<script>
import bnbIcon from '@/assets/icons/tokens/bnb.svg';
import { reduceStringLength } from '@/util/helpers';
import axios from 'axios';
import { useDiscordStore } from '~/store/discord';
import creditsIcon from '@/assets/icons/Credits.svg';

export default {
  name: 'Amount',
  data() {
    return {
      rewardsArray: [],
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
    task: { type: Object, default: {} },
  },
  async mounted() {
    if (this.task) {
      this.getTaskRewards(this.task);
    }
  },
  methods: {
    async getTaskRewards(task) {
      console.log(123);
      if (task.rewards && task.rewards.length) {
        const isCoinsExist = task.rewards.find((reward) => reward.type === 'coins');
        const isCreditsExist = task.rewards.find((reward) => reward.type === 'credits');
        const isDiscordExist = task.rewards.find((reward) => reward.type === 'discord_role');
        if (isCoinsExist && !this.rewardsArray.some((item) => item.type === 'coin')) {
          const icon = this.getCuttencyIcon(task.coin_type.name);
          const rewardString = `${isCoinsExist.value} ${
            task.coin_type.symbol.toUpperCase() || task.coin_type.name.toUpperCase()
          }`;
          this.rewardsArray.push({ rewardString, icon, type: 'coin' });
        }
        if (isCreditsExist) {
          if (this.rewardsArray.some((item) => item.type === 'credits')) {
            this.rewardsArray = this.rewardsArray.filter((item) => item.type !== 'credits');
          }
          const icon = creditsIcon;
          const rewardString = `${isCreditsExist.value}`;
          this.rewardsArray.push({ rewardString, icon, type: 'credits' });
        }
        if (isDiscordExist && !this.rewardsArray.some((item) => item.type === 'discord')) {
          try {
            const discordRoles = await useDiscordStore().getDiscordRoleAction(task.project.id);
            const discordData = discordRoles.find((item) => item.id === isDiscordExist.value);
            if (discordData && discordData.name) {
              this.rewardsArray.push({
                rewardString: '',
                // rewardString: discordData.name,
                icon: 'Discord-Circle',
                type: 'discord',
              });
            } else {
              this.rewardsArray.push({
                rewardString: '',
                icon: 'Discord-Circle',
                type: 'discord',
              });
            }
          } catch (error) {
            console.log('DISCORD ERROR', error);
            this.rewardsArray.push({
              rewardString: '',
              icon: 'Discord-Circle',
              type: 'discord',
            });
          }
        }
        console.log('this.rewardsArray', this.rewardsArray);
      }
    },
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
.rewards {
  display: flex;
  gap: 10px;
}
.reward {
  display: flex;
  gap: 5px;
  align-items: center;
  color: #38405b;
  font-variant-numeric: slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  img {
    width: 24px;
    height: 24px;
  }
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
