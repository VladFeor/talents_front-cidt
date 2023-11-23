<template>
  <div class="w-full h-[64px] rounded-lg flex">
    <div class="flex flex-col items-center h-full w-[64px] bg-[#DAD9F7] rounded-l-lg border border-[#DAD9F7] px-[10px] pt-[8px] pb-[2px]">
      <div class="text-xs leading-4 tracking-[.014em] font-medium h-4 text-[#38405B]">{{ started_at_month }}</div>
      <h4 class="h-10 font-normal text-2xl leading-10 w-[15px] text-[#38405B]">{{ started_at_day }}</h4>
    </div>
    <div class="flex flex-col justify-center bg-[#F5F5FD] rounded-r-lg w-[calc(100%-64px)] px-3">
      <div class="h-6 font-medium text-base leading-6 text-[#38405B]">{{ event.title }}</div>
      <div class="mt-1 text-xs font-medium leading-4 tracking-[.014em] text-[#6A6D8F] slashed-zero">{{ started_at_time }}–11:00</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps(['event']);
  const date = new Date(props.event.started_at);
  const endDate = new Date(props.event.ended_at);
  const started_at_day = computed(() => date.getDay())
  const started_at_month = computed(() => date.toLocaleString('default', { month: 'long' }))
  const started_at_time = computed(() => date.getHours().toString() + ':' + date.getMinutes().toString());
  const ended_at_time = computed(() => endDate.getHours().toString() + ':' + endDate.getMinutes().toString());
</script>

<style scoped lang="scss">

</style>