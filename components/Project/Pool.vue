<template>
  <ContentBox class="h-[120px] w-full p-4 bg-white">
    <div class="pool-name_wrapper">
      <h5 class="font-medium text-[#6A6D8F] text-lg leading-6">Pool</h5>
      <TooltipIcon
        tooltipText="The amount of funds intended to be spent on collaboration with Talents"
      />
    </div>
    <div class="mt-2 flex">
      <Coin
        v-if="project && project.coin_type"
        :name="`${project.coin_type.symbol}-Circle`"
        :size="40"
      />
      <Icon name="USDT-Circle" :size="40" v-else />
      <div
        class="text-[#1A1D29] text-[32px] font-normal ml-3 slashed-zero"
        v-if="project.pool_amount && project.coin_type"
      >
        {{ project.pool_amount }} {{ project.coin_type?.symbol }}
      </div>
      <div class="ml-3 slashed-zero flex" v-else>
        <div class="text-[#AAA7CC] text-[32px] font-normal border-b border-dashed">0 USDT</div>
      </div>
    </div>
  </ContentBox>
</template>

<script setup lang="ts">
const props = defineProps(['project']);
</script>

<style scoped lang="scss">
.pool-name_wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
