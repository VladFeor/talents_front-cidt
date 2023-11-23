<template v-if="project.id !== firstProject.id">
  <div @click="handleClick(project.id)"
    class="mb-4 shrink-0 grow-0 last-project-child w-[calc(25%-12px)] h-[336px] max-h-[336px] bg-white border border-[#DAD9F7] rounded-[16px]">
    <div class="h-[128px] rounded-[16px] relative">
      <div class="absolute top-4 left-4 flex">
        <div
          class="w-6 h-6 flex justify-center items-center bg-white rounded-[50%]"
          v-if="project.blockchain"
        >
          <Blockchain :name="`${project.blockchain.name}`" :size="18"></Blockchain>
        </div>
      </div>
      <div v-if="project.banner" class="bg-no-repeat bg-cover bg-center rounded-t-[16px] h-full"
        :style="{ backgroundImage: `url(${project.banner})` }" />
      <div v-else class="bg-no-repeat bg-default-cover bg-cover bg-center rounded-t-[16px] h-full" />
    </div>
    <div class="p-4 pb-0 pt-10 relative bg-white rounded-b-[16px] flex flex-col h-[200px]">
      <div
        class="h-12 bg-white rounded-[8px] flex items-center justify-center w-auto border border-[#DAD9F7] p-2 absolute -top-[25px]">
        <div class="rounded-[8px] h-8 w-8 object-contain" :style="{
          background: `url(${project.logo !== null ? project.logo : DefaultProjectAvatar
            }) no-repeat`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }" />
        <div class="text-base leading-6 font-medium ml-2">
          {{ reduceStringLength(project.name, 15) }}
        </div>
      </div>
      <Icon name="Verified" :size="25" class="absolute -top-[13px] right-4" />
      <div class="flex font-medium text-xs text-[#6A6D8F] leading-4 h-4">
        <span>{{ project.tasks_count ? project.tasks_count : 0 }} tasks</span>
        <span class="ml-4">{{ project.members_count }} talents</span>
        <span class="ml-auto">{{ project.members_exists ? 'Joined' : '' }}</span>
      </div>
      <div class="mt-4 font-medium text-xs text-[#1A1D29] break-words max-h-12 overflow-hidden"
        v-html="reduceStringLength(removeLineBreak(project.description), 100)" />
      <div class="flex flex-wrap justify-start mt-auto">
        <Categories :expand="false" :limit="4" :categories="project.tags"
          cat-class="!bg-[#F5F5FD] border !border-[#EAEAFB] !h-6" cat-text-class="!text-[#38405B] font-medium" />
      </div>
    </div>
  </div>
  <BaseModal :visible="isVerifying" :width="520" @close="isVerifying = false">
    <GateVerificationModal :isVerified="isProjectVerified" :type="'project'" :data="project"
      @success="isProjectVerified = true" @cancel="isVerifying = false" />
  </BaseModal>
</template>

<script setup>
import DefaultProjectAvatar from 'assets/images/Project-Avatar.svg';
import { useUserStore } from '~/store';
import { useProjectsStore } from '~/store/projects';
import { reduceStringLength, removeLineBreak } from '~/util/helpers';

const props = defineProps(['project', 'firstProject']);

const emit = defineEmits(['connectWallet'])

const router = useRouter();

const projectsStore = useProjectsStore();
const userStore = useUserStore();

const isProjectVerified = ref(false);
const isVerifying = ref(false);

const handleClick = (projectId) => {
  if (projectsStore.getProjectVerification.find(el => el === projectId)) {
    router.push(`/projects/${projectId}`);
  } else if ( props.project?.conditions.length && !userStore.user.wallet) {
    emit('connectWallet', true);
  } else {
    if (props.project.conditions.length) {
      isVerifying.value = true;
    } else {
      router.push(`/projects/${projectId}`);
    }
  }
}

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
