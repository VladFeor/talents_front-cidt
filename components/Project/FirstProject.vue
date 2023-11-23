<template>
  <div
    :class="`relative p-8 bg-no-repeat bg-cover bg-center rounded-[16px] h-full
            ${!project && 'animate-pulse bg-default-cover'}
            ${project && !project.banner && 'bg-default-cover'}
    `"
    :style="{ backgroundImage: project?.banner && `url(${project?.banner}` }"
    @click="router.push(`/projects/${project.id}`)"
  >
    <div v-if="project" class="absolute bottom-8 w-[calc(100%-4rem)]">
      <h2 class="text-[48px] font-semithin leading-[64px] h-[64px] text-white">
        <nuxt-link :to="`/projects/${project.id}`">
          {{ project.name }}
        </nuxt-link>
      </h2>
      <div class="flex justify-between items-center mt-[27px]">
        <Categories class="w-fit" catClass="!mb-0" :categories="project.tags" :show-all="true" />

        <div class="flex items-center justify-end">
          <div class="bg-[#EAEAFB] rounded-md w-8 h-8 justify-center items-center flex ml-2">
            <Icon class="cursor-pointer" name="Left" :size="20" @click.stop="$emit('prevRow')" />
          </div>
          <div class="bg-[#EAEAFB] rounded-md w-8 h-8 justify-center items-center flex ml-2">
            <Icon class="cursor-pointer" name="Right" :size="20" @click.stop="$emit('nextRow')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['project']);
const emits = defineEmits(['prevRow', 'nextRow']);
const router = useRouter();
</script>

<style scoped lang="scss">
.bg-default-cover {
  background-image: url(@/assets/images/ProjectCover.svg);
}
.font-semithin {
  font-weight: 350;
}
</style>
