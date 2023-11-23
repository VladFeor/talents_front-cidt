<template>
  <ContentBox
      :class="`h-auto w-full p-4 bg-white  ${project.pool_visible ? 'min-h-[184px] mt-6' : 'mt-0 min-h-[210px]'}`">
    <h5 class="font-medium text-[#6A6D8F] text-lg leading-6">
      Upcoming Events
    </h5>
    <template v-if="project.events && project.events.length > 0">
      <ProjectEvent v-for="event in project.events" :event="event" class="mt-6" />
    </template>
    <ProjectEventEmpty class="mt-6" v-else />
  </ContentBox>
</template>

<script setup lang="ts">
  const props = defineProps(['project'])
</script>

<style scoped lang="scss">

</style>