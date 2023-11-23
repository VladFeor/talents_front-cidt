<template>
  <div class="project-detail" v-if="project">
    <div :class="`h-[260px] w-[calc(100%+88px)] bg-banner -ml-12 -mt-12 ${!project.banner && 'bg-default-banner'
      }`" :style="{ backgroundImage: project.banner && `url(${project.banner}` }" />
    <div class="h-[160px] -mt-20 flex justify-between">
      <div class="flex items-end">
        <div :class="`h-full w-[160px] bg-profile object-contain rounded-2xl border-3 border-[#F5F5FD] ${!project.logo && 'bg-profile-default'
          }`" :style="{ backgroundImage: project.logo && `url(${project.logo}` }" />
        <h1 class="text-[56px] font-semithin text-[#1A1D29] leading-18 ml-6">
          {{ reduceStringLength(project.name, 25) }}
        </h1>
      </div>
      <div class="flex items-end font-medium text-base">
        <button @click="reportWindow = true" class="leading-6 text-[#6A6D8F] mb-2">Report</button>
        <button @click="joinProject" class="px-3 bg-[#FC660C] rounded-lg ml-9 h-10 flex items-center justify-center"
          v-if="!projectJoined && !joinedLoading">
          <span class="leading-6 text-white">Join Project</span>
          <img src="@/assets/images/users-icon.svg" class="ml-2 h-5 w-5" alt="user-icon" />
        </button>
        <button @click="leaveProject" class="px-3 bg-[#FC660C] rounded-lg ml-9 h-10 flex items-center justify-center"
          v-if="projectJoined && !joinedLoading">
          <span class="leading-6 text-white">Leave Project</span>
          <img src="@/assets/images/users-icon.svg" class="ml-2 h-5 w-5" alt="user-icon" />
        </button>
      </div>
    </div>
    <div class="w-full mt-10 flex">
      <Content class="min-w-[700px]" :project="project" :socialsProviders="socialsProviders" :socialLinks="socialLinks"
        :date-since="dateSince" />
      <div class="ml-10 flex flex-col min-w-[360px]">
        <RefLink v-if="project.public" :code="code"></RefLink>
        <Pool v-if="project && project.pool_visible" :project="project" />
        <Events :project="project" />
      </div>
    </div>
    <div class="mt-10" v-if="projectMediumPosts && projectMediumPosts.length > 0">
      <div class="font-normal text-2xl mb-4 text-[#1A1D29] leading-10">Last Articles on Medium</div>
      <div class="mt-4 flex flex-wrap">
        <ArticleItem class="mr-4 mb-4 last-article-item" v-for="post in projectMediumPosts.slice(0, 3)" :image="demoImage"
          :post="post" />
      </div>
    </div>
    <hr class="my-11 bg-[#DAD9F7]" />
    <div class="mb-10">
      <div class="flex justify-between">
        <h2 class="text-[#1A1D29] h-[64px] text-[48px] leading-[64px] font-semithin">
          Available Tasks
        </h2>
        <div class="flex items-center">
          <nuxt-link to="/tasks">
            <span class="font-base text-[#6A6D8F] leading-6 h-6 font-medium">View All Tasks</span>
            <Icon name="Right-Arrow" :size="20" class="ml-[13px]" />
          </nuxt-link>
        </div>
      </div>
      <div v-if="tasksRows && tasksRows.length" class="mt-4 flex flex-wrap gap-4">
        <TaskCard v-for="task in tasksRows" :task="task" :key="task.name + task.priority"
          :isPersonalTask="task.assigned_to_user" :personalColor="task.personalColor" @connect-wallet="(value) => isShowConnectModal = value"/>
      </div>
      <div v-else class="mt-4 flex flex-wrap">
        <div class="mb-4 w-full">
          <EmptyList icon="icons8-futurama-nibbler" title="It seems you have nothing to do here" />
        </div>
      </div>
    </div>
  </div>
  <Report @send="reportProject" @close="reportWindow = false" :report-reasons="reportTypes"
    :report-window="reportWindow" />
  <BaseModal :width="480" @close="isShowConnectModal = false" :visible="isShowConnectModal" :isScrollOff="true">
    <ConnectWalletModal @close="toggleWalletConnecting" />
  </BaseModal>
  <BaseModal :visible="isProjectVerifying" :width="520" :isCloseBtnInvisible="true">
    <GateVerificationModal :isVerified="isProjectVerified" :type="'project'" :data="project" :isSuccessSkipped="true"
      @success="handleSuccessProjectVerification" @cancel="router.push('/projects')" />
  </BaseModal>
  <Report
    @send="reportProject"
    @close="reportWindow = false"
    :report-reasons="reportTypes"
    :report-window="reportWindow"
  />
  <InaccessibleLinkModal
    v-if="showErrorModal"
    title="Project Unavailable"
    text="The project you are trying to access is no longer available. It may have been made private or deleted. For further assistance, contact your project manager or administrator."
    link="/"
    button="Go to the Homepage"
  ></InaccessibleLinkModal>
  <GetAccess
    :project="project"
    v-if="project && project.survey_form && project.survey_form.meta_status !== 'accepted'"
  ></GetAccess>
</template>

<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import { computed, ref } from 'vue';
import { useProjectsStore, useUserStore } from '@/store';
import { Amount, Badge, Content, Events, Pool, Priority, Talent } from '~/components/';
import Rewards from '@/components/Rewards.vue';

import {
  formatDate,
  formatDateMonthNameAndDay,
  getBadgeTypeByName,
  reduceStringLength,
  timestampToString,
} from '~/util/helpers';
import { useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const userStore = useUserStore();

const projectsVerification = projectsStore.verifiedProjects;

const showErrorModal = ref(false);
onBeforeMount(() => {
  console.log('BEFOREMOUNT');
  localStorage.ref = localStorage.ref || route.query.ref;
  localStorage.projectId = route.params.id;
});

onMounted(() => {
  console.log('ONMOUNT');
  localStorage.ref = localStorage.ref || route.query.ref;
  localStorage.projectId = route.params.id;
  projectsStore.getProjectAction(route.params.id).catch((e) => (showErrorModal.value = true));
  projectsStore.getProjectCode(route.params.id);
  projectsStore.getReportTypesAction();
});

const nuxtApp = useNuxtApp();
const reportTypes = computed(() => projectsStore.getReportTypes);
const code = computed(() => projectsStore.getCode);
const projectData = computed(() => projectsStore.getProject);
const joinedLoading = computed(() => projectsStore.getJoinedLoading);
const project = computed(() => projectData.value);

const projectMediumPosts = computed(() => projectsStore.getProjectMediumPosts);
const dateSince = computed(() => formatDateMonthNameAndDay(project.value.created_at, true));
const isGatedProject = computed(() => !!project.value.conditions?.filter(el => el.type === 'gate')?.length);

const tasksRows = computed(() => {
  const tasksArray = project.value.tasks;
  if (!tasksArray || (tasksArray && !tasksArray.length)) {
    return [];
  }
  return tasksArray.map((item) => {
    return {
      id: item.id,
      to: `/tasks/task/${item.id}`,
      personalColor: item.activity ? item.activity.name.toLowerCase().split(' ').join('_') : 'all',
      task: {
        content: item.name,
      },
      assigned_to_user: item.assigned_to_user,
      multiRewards: {
        component: Rewards,
        props: {
          amount: item.rewards && item.rewards.length ? item.rewards[0].value : '0',
          currency: item.coin_type.symbol.toLowerCase(),
          isMoreBtn: item.rewards.length > 1 ? true : false,
          rewards: item.rewards,
          projectId: item.project && item.project.id ? item.project.id : 0,
          task: item,
        },
      },
      rewards: {
        component: Amount,
        props: {
          amount: item.rewards && item.rewards.length ? item.rewards[0].value : '0',
          currency: item.coin_type.symbol?.toLowerCase() || item.coin_type.name?.toLowerCase(),
          isMoreBtn: item.rewards.length > 1,
          rewards: item.rewards,
          projectId: item.project && item.project.id ? item.project.id : 0,
        },
      },
      project: {
        component: Talent,
        props: {
          id: project.id,
          text: project.value.name,
          img: project.value.logo || defaultBg,
          square: true,
          reduceLength: 15,
          conditions: project.conditions
        },
      },
      direction: {
        component: Badge,
        props: {
          text: item.activity ? item.activity.name : 'All',
          value: '',
          type: getBadgeTypeByName(item.activity ? item.activity.name : 'All'),
          big: false,
        },
      },
      start: {
        component: Badge,
        props: {
          text: formatDate(timestampToString(item.started_at)),
          value: '',
          type: 'transparent',
          big: false,
        },
      },
      deadline: {
        component: Badge,
        props: {
          text: formatDate(timestampToString(item.ended_at)),
          value: '',
          type: 'transparent',
          big: false,
          futureDate: timestampToString(item.ended_at),
        },
      },
      priority: {
        component: Priority,
        props: {
          dots: item.priority,
        },
      },
      chainConditions: item.chain_conditions,
      workingUsers: item.working_users,
      any: item.any
    };
  });
});
// const socialButtons = computed(() =>
//   project.value.social_links.map((link) => ({
//     id: link.id,
//     icon: link.social_link.icon,
//     status: link.social_link.name,
//     name: link.social_link.name,
//     value: link.content,
//     fn: () => null,
//     rm: () => null,
//   })),
// );

const socialsProviders = computed(() =>
  project.value.social_providers.filter(
    (i) =>
      i.provider_name !== 'telegram_bot' &&
      i.provider_name !== 'discord_bot' &&
      i.provider_name !== 'telegram',
  ),
);
const socialLinks = computed(() => project.value.social_links);
const projectJoined = ref(false);
const reportWindow = ref(false);
const isShowConnectModal = ref(false);

const isProjectVerified = ref(false);
const isProjectVerifying = ref(false);

const reportProject = async (data) => {
  let res = await projectsStore.reportProjectAction({
    id: project.value.id,
    type_id: data.type_id,
    text: data.text,
  });
  if (res && res?.response?.status !== 204) {
    nuxtApp.$alert.show(res.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
  } else {
    nuxtApp.$alert.show('You have successfully reported the project', {
      type: 'success',
      timeout: 5000,
    });
    reportWindow.value = false;
  }
};
const joinProject = async () => {
  if (project.value && project.value.id) {
    const referral_code = localStorage.ref || route.query.ref;

    console.log('referral_code', referral_code);

    projectJoined.value = !projectJoined.value;
    if (referral_code && referral_code != undefined && referral_code != 'undefined') {
      await projectsStore
        .joinProjectAction({ id: project.value.id, referral_code })
        .catch(() => (showErrorModal.value = true));
    } else {
      await projectsStore.joinProjectAction({ id: project.value.id });
    }

    window.dataLayer.push({
      event: 'talent_join_project',
    });

    nuxtApp.$alert.show('You have successfully joined the project', {
      type: 'success',
      timeout: 5000,
    });
  }
};
const leaveProject = async () => {
  if (project.value && project.value.id) {
    let res = await projectsStore.leaveProjectAction(project.value.id);
    if (res && res?.response?.status !== 204) {
      nuxtApp.$alert.show(res.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    } else {
      projectJoined.value = !projectJoined.value;
      nuxtApp.$alert.show('You have successfully leaved the project', {
        type: 'success',
        timeout: 5000,
      });
    }
  }
};
const toggleWalletConnecting = () => {
  isShowConnectModal.value = !isShowConnectModal.value;
}

const closeAllWalletModals = () => {
  isShowConnectModal.value = false;
  router.push("/projects");
}

const handleSuccessProjectVerification = () => {
  isProjectVerifying.value = false;
  isProjectVerified.value = true;
}

watch(
  project,
  (value) => {
    if (!value) return;
    let { member_exists } = value;
    let { medium_username } = value;
    if (medium_username) {
      projectsStore.getProjectMediumPostsAction({ medium_username });
    }
    if (member_exists) {
      projectJoined.value = member_exists;
    }
  },
  { deep: true, immediate: true },
);

watch(
  project,
  (value) => {
    if (!value) return;
    let { member_exists } = value;
    let { medium_username } = value;
    if (medium_username) {
      projectsStore.getProjectMediumPostsAction({ medium_username });
    }
    if (member_exists) {
      projectJoined.value = member_exists;
    }
    if (project.value?.conditions?.filter(el => el.type === 'gate')?.length && !userStore.user.wallet) {
      isShowConnectModal.value = true;
    } else {
      if (!projectsVerification.includes(+route.params.id) && project.value.conditions.length) {
        isProjectVerifying.value = true;
      }
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => userStore.user,
  (value) => {
    if (value.wallet) {
      if (!projectsVerification.includes(+route.params.id)) {
        isProjectVerifying.value = true;
      }
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.project-detail {
  font-family: 'Basis Grotesque Pro', serif;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  color: $section-title;

  .font-semithin {
    font-weight: 350;
  }

  .last-article-item {
    &:nth-child(3n) {
      margin-right: 0 !important;
    }
  }

  .bg-banner {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .bg-default-banner {
    background: url('@/assets/images/def-cover-project.svg') no-repeat center;
  }

  .bg-profile {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .bg-profile-default {
    background: url('@/assets/images/Project-Avatar.svg') no-repeat center;
  }
}
</style>
