<template>
    <div class="task-status">
        <div class="header">
            <div class="header_avatar">
                <img :src="data.project_avatar" alt="project-logo"/>
                {{ data.project_name }}
            </div>
            <div class="header_status" :class="{success: isSuccess, fail: !isSuccess}">
                <img v-if="isSuccess" src="@/assets/icons/success-status.svg" alt="status-svg" />
                <img v-else src="@/assets/icons/error-status.svg" alt="status-svg" />
                {{ verificationStatus }}
            </div>
        </div>
        <div class="title">{{ data.task_name }}</div>
        <div class="rewards">
            <Coin v-if="isCoins" :name="data.coin_type.code + '-Default'" :size="24" />
            <div v-if="isCoins" class="amount">
                {{ isCoins.formatted_value }} {{ data.coin_type.code }}
            </div>
            <Icon icon="Discord-Default" v-if="isRole" :size="24" />
            <div v-if="isCredits" class="amount">{{ isCredits.formatted_value }}</div>
            <img
                src="@/assets/icons/Credits.svg"
                v-if="isCredits"
                class="w-[24px] h-[24px]"
                alt="credits"
            />
        </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

console.log(props.data);
const isRole = computed(() => props.data.rewards.find((i) => i.type === 'discord_role'));
const isCoins = computed(() => props.data.rewards.find((i) => i.type === 'coins'));
const isCredits = computed(() => props.data.rewards.find((i) => i.type === 'credits'));
const verificationStatus = computed(() => {
    console.log(props.data.verification?.status);
    switch (props.data.verification?.status) {
        case "success":
            return "Verified"
        case "failed":
            return "Not Verified"
        case "error": 
            return "Indexator Error"
        default: 
            return "Not Verified"
    }
})
const isSuccess = computed(() => props.data.verification?.status === "success");
</script>

<style lang="scss" scoped>
.task-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;

    &_avatar {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.014em;
        color: #38405B;

        img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }
    }
    &_status {
        display: flex;
        align-items: center;
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: right;
        padding: 3px 10px 3px 8px;
        border-radius: 6px;

        img {
            margin-right: 5px;
        }
    }

    .success {
        border: 1px solid #BCE0BC;
        color: #1D8F1D;
    }

    .fail {
        border: 1px solid #FFC0B7;
        color: #CC2D14;
    }
  }
  .title {
    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
  .rewards {
    display: flex;
    align-items: center;
    gap: 4px;
    .amount {
      color: $default;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
    }
  }
}
</style>