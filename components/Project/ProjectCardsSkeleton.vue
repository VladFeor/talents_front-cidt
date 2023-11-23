<template>
  <div
    v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
    :key="i"
    class="animate-pulse mb-4 shrink-0 grow-0 last-project-child w-[calc(25%-12px)] h-[336px] max-h-[336px] bg-white border border-[#DAD9F7] rounded-[16px]"
  >
    <div class="h-[128px] rounded-[16px] relative">
      <div class="absolute top-4 left-4 flex">
        <div class="w-6 h-6 flex items-center"></div>
      </div>
      <div class="bg-no-repeat bg-default-cover bg-cover bg-center rounded-t-[16px] h-full" />
    </div>
    <div class="p-4 pb-0 pt-10 relative bg-white rounded-b-[16px]">
      <div
        class="h-12 bg-white rounded-[8px] flex items-center justify-center w-auto border border-[#DAD9F7] p-2 absolute -top-[25px]"
      >
        <img class="rounded-[8px] h-8 w-8 object-contain" :src="DefaultProjectAvatar" alt="" />
        <div class="text-base leading-6 font-medium ml-2" />
      </div>
      <div class="flex font-medium text-xs text-[#6A6D8F] leading-4 h-4" />
      <div class="mt-4 font-medium text-xs text-[#1A1D29] break-words" />
      <div class="mt-4 flex flex-wrap justify-start" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultProjectAvatar from 'assets/images/Project-Avatar.svg';
import { reduceStringLength } from '~/util/helpers';

const props = defineProps(['project', 'firstProject']);
</script>

<style scoped lang="scss">
.bg-default-cover {
  background-image: url(@/assets/images/ProjectCover.svg);
}

@media screen and (max-width: 1030px) {
  .last-project-child {
    margin-right: 16px;
    &:nth-child(2n) {
      margin-right: 0 !important;
    }
  }
}

@media screen and (min-width: 1030px) and (max-width: 1320px) {
  .last-project-child {
    margin-right: 16px;
    &:nth-child(3n) {
      margin-right: 0 !important;
    }
  }
}

@media screen and (min-width: 1320px) {
  .last-project-child {
    margin-right: 16px;
    &:nth-child(4n) {
      margin-right: 0 !important;
    }
  }
}
</style>
