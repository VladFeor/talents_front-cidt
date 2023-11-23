<template>
  <div v-if="task" class="task_wrapper">
    <BtnSkeleton v-if="taskLoading" />
    <BackBtn v-else :text="task.project.name" :img="task.project.logo"
      :to="`/tasks?tasksStatus=${task.status_by_dates}`" />
    <BtnSkeleton v-if="taskLoading" />
    <div v-else class="task-name">{{ task.name }}</div>
    <div class="task-body">
      <TableSkeleton v-if="taskLoading" />
      <div v-else class="task-data">
        <div class="main-task-data">
          <div class="task-info_wrapper">
            <div class="task-info">
              <Badge :text="task.activity ? task.activity.name : 'All'"
                :type="getBadgeTypeByName(task.activity ? task.activity.name : 'All')" :big="false" />
              <div class="task-priority">Priority
                <Priority :dots="task.priority" />
              </div>
              <div class="task-date">
                <Badge :text="formatDate(timestampToString(task.started_at))" type="transparent" :big="false" />
                -
                <Badge :text="formatDate(timestampToString(task.ended_at))" type="transparent" :big="false" />
              </div>
            </div>
            <div class="task-status">
              <!-- <Badge
                :text="getTaskStatus(task.status_by_dates)"
                isStatusIcon
                type="transparent"
                :big="false"
              /> -->
              <TaskStatusNew :status="task.status_by_dates"></TaskStatusNew>
            </div>
          </div>
          <div v-if="task.verifier_driver && task.verifier_driver === 'twitter'" class="social-driver_title">
            Twitter Activities to Complete the Task
          </div>
          <TwitterCard v-if="task.verifier_driver && task.verifier_driver === 'twitter'" small :task="task"
            :status="task.status_by_dates" isFollow />
          <TwitterCard v-if="task.verifier_driver && task.verifier_driver === 'twitter'" :task="task"
            :status="task.status_by_dates" isShowBtns btnsDisabled isPost />
          <TwitterCard v-if="task.verifier_driver &&
            task.verifier_driver === 'twitter' &&
            task.verifier.types.some((item) => item === 'twitter_tweet')
            " :task="task" :status="task.status_by_dates" isTweetLink />
          <TwitterCard v-if="task.verifier_driver &&
            task.verifier_driver === 'twitter' &&
            task.verifier.types.some((item) => item === 'twitter_space')
            " :task="task" :status="task.status_by_dates" isSpace />
          <TelegramCard v-if="task.verifier_driver && task.verifier_driver === 'telegram'" :task="task" isDisabled />
          <!-- <TwitterCard
            v-if="task.verifier_driver && task.verifier_driver === 'twitter'"
            :task="task"
          /> -->

          <div v-if="task.verifier_driver && task.verifier_driver === 'discord'" class="discord-card_wrapper">
            <div class="social-driver_title" v-if="task.verifier_driver && task.verifier_driver === 'discord'">
              Join Discord Server to Complete the Task
            </div>

            <DiscordCard v-if="task.verifier_driver && task.verifier_driver === 'discord'" :task="task" isDisabled />
          </div>
          <div v-if="task.verifier_driver && task.verifier_driver === 'reddit'" class="flex gap-4"
            style="flex-direction: column">
            <RedditPostCard class="mb-5" v-if="task.verifier.types.includes('reddit_comment_post') ||
              task.verifier.types.includes('reddit_save_post') ||
              task.verifier.types.includes('reddit_vote_post')
              " disabled :is-comment="task.verifier.types.includes('reddit_vote_post')"
              :is-save="task.verifier.types.includes('reddit_save_post')"
              :is-vote="task.verifier.types.includes('reddit_vote_post')" :url="task.verifier.reddit_post"
              :id="task.verifier.reddit_post_id"></RedditPostCard>
            <RedditCommunityCard class="mb-5" v-if="task.verifier.types.includes('reddit_join_community') ||
              task.verifier.types.includes('reddit_own_post')
              " :is-community="task.verifier.types.includes('reddit_join_community')"
              :is-own-post="task.verifier.types.includes('reddit_own_post')" disabled
              :words="task.verifier.reddit_post_words" :post="task.verifier.reddit_default_post"
              :url="task.verifier.reddit_community" :id="task.verifier.reddit_community_id"></RedditCommunityCard>
            <RedditKarmaCard class="mb-5" :karma="task.verifier.reddit_karma_score"
              v-if="task.verifier.types.includes('reddit_karma_score')" disabled></RedditKarmaCard>
            <RedditTrophiesCard class="mb-5" :trophies="task.verifier.reddit_trophies"
              v-if="task.verifier.types.includes('reddit_trophies')" disabled></RedditTrophiesCard>
          </div>

          <div v-if="task.is_invite_friends" class="discord-card_wrapper">
            <div class="social-driver_title" v-if="task.is_invite_friends">
              Invite {{ task.number_of_invites }} Friends to Join the Project to Complete the Task
            </div>

            <TaskInvitesCard v-if="task.is_invite_friends" :description="task.project.description"
              :protocol="task.project.name" :tags="task.project.tags" :bg="task.project.banner" :logo="task.project.logo"
              :task="task" :status="task.status_by_dates" />
          </div>

          <!-- <Editor :description="task.text" /> -->
          <div class="task-content" v-if="!hasHtml(task.text)">
            {{ task.text }}
          </div>

          <div v-else class="task-content html"
            :class="{ list: isTaskHasList(task.text), long: isTaskHasLongWord(task.text) }"
            v-html="addLinksToText(task.text)"></div>
        </div>
        <FileListViewer v-if="task.images.length" @zoomInImage="zoomInImage" :files="task.images" />

        <TaskCondition v-if="taskChainCondition" :condition="taskChainCondition" />
      </div>
      <CalendarSkeleton v-if="taskLoading" />
      <div v-else class="task-sidebar">
        <div v-if="rewardsArray.length" class="task-sidebar-card">
          <div class="task-sidebar-card_header">
            <div class="task-sidebar-review-card_title_wrapper">
              <div class="task-sidebar-review-card_title">Rewards</div>

              <div
                v-if="rewardsArray.some((item) => item.type === 'coin')"
                class="task-sidebar-card_subtitle"
              >
                <span>{{ task.coin_type.blockchain.name }}</span>
              </div>
            </div>
          </div>

          <div v-for="taskReward in rewardsArray" :key="taskReward.rewardString" class="task-sidebar-card_reward">
            <div class="task-sidebar-card_reward-amount">{{ taskReward.rewardString }}</div>
            <img v-if="taskReward.type === 'credits'" :src="taskReward.icon" alt="" />
            <Coin v-if="taskReward.type === 'coin'" :name="task.coin_type.symbol + '-Default'" :size="36" />
            <Icon v-else :name="taskReward.icon" :size="36" />
          </div>
        </div>

        <ReportsCard v-if="task.status_by_dates !== 'available' && task.status_by_dates !== 'upcoming'" />

        <BaseButton v-if="task.status_by_dates === 'available' && !task.in_work" class="w-full" text="Take in Work"
          type="normal" @click="takeTask" />
        <BaseButton v-if="task.status_by_dates === 'in_progress' &&
          !task.task.is_invite_friends &&
          !task.task.autovalidate
          " class="w-full" text="Complete Task" type="normal" @click="visible = true" />
      </div>
    </div>
    <BaseModal :visible="isProjectVerifying" :width="520" :isCloseBtnInvisible="true">
      <GateVerificationModal :isVerified="isProjectVerified" :type="'project'" :data="task.project"
        :isSuccessSkipped="true" @success="handleSuccessProjectVerification" @cancel="router.push('/tasks')" />
    </BaseModal>
    <BaseModal :visible="isTaskVerifying" :width="520" @close="router.push('/tasks')">
      <GateVerificationModal :isVerified="isTaskVerified" :type="'task'" :data="task" :isSuccessSkipped="true"
        @success="handleSuccessTaskVerification" @cancel="router.push('/tasks')"/>
    </BaseModal>
  </div>
  <ZoomImage v-if="isOpenZoom" @close="closeZoomModal" :image="activeImage" />

  <BaseModal :width="600" :top="150" maxHeight="608px" @close="handleClose($event)" :visible="visible">
    <WorkingTalentsModal :taskId="taskId" />
  </BaseModal>
  <BaseModal
    @close="handleShowSocialConnectModal($event)"
    :visible="isShowSocialConnectModal"
    isScrollOff
  >
    <div class="task-connect-social-modal">
      <div class="task-connect-social-modal_title">
        <span>Get Access to the Task</span>
      </div>
      <div class="task-connect-social-modal_subtitle">
        This task requires you to connect to your {{ capitalize(task.verifier_driver) }} account
        this task
      </div>
      <div class="task-connect-social-modal_btn" @click="connectSocial(task.verifier_driver)">
        <Icon :name="`${capitalize(task.verifier_driver)}-Default`" :size="24" class="icon" />
        <span>Connect {{ capitalize(task.verifier_driver) }}</span>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
  getTaskStatus,
  isTaskHasList,
  timestampToString,
  isTaskHasLongWord,
  addLinksToText,
} from '@/util/helpers';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, onUnmounted } from 'vue';
import { useTasksStore } from '~/store/tasks';
import { useDiscordStore } from '~/store/discord';
import { useAuthStore } from '~/store/auth';
import { useUserStore } from '~/store/user';
import { useProjectsStore } from '~/store';
import axios from 'axios';
import axiosService from '~/service/axiosService';
import creditsIcon from '@/assets/icons/Credits.svg';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();
const discordStore = useDiscordStore();
const userStore = useUserStore();
const projectsStore = useProjectsStore();
const nuxtApp = useNuxtApp();

const projectsVerification = projectsStore.verifiedProjects;
const tasksVerification = projectsStore.verifiedTasks;

const rewardsArray = ref([]);
const visible = ref(false);
const isShowSocialConnectModal = ref(false);

const activeImage = ref(null);
const isOpenZoom = ref(false);
const creditsAmount = ref(0);

const isShowConnectModal = ref(false);
const isShowConnectionModal = ref(false);
const isConnectingError = ref(false);
const isWalletChecked = ref(false);
const isProjectVerified = ref(false);
const isProjectVerifying = ref(false);
const isTaskVerified = ref(false);
const isTaskVerifying = ref(false);

async function connectSocial(socialName) {
  localStorage.social = socialName;
  axiosService
    .get(useRuntimeConfig().public.apiBase + `auth/${socialName}/redirect?uri=/tasks`)
    .then((response) => {
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => console.log(e));
}

const handleShowSocialConnectModal = (event) => {
  router.push('/tasks');
  isShowSocialConnectModal.value = event;
};

function capitalize(str) {
  let words = str.split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(' ');
}

const task = computed(() => tasksStore.getTask);
const taskId = computed(() => tasksStore.getTask.id);

console.log('task', task);

const taskLoading = computed(() => tasksStore.getTaskLoading);
const taskLoaded = computed(() => tasksStore.getTaskLoaded);
const user = computed(() => userStore.getUser);
const taskChainCondition = computed(() => task.value.chain_conditions.find((el) => el.type === "main")); 

watch(
  [() => user.value, () => task.value],
  ([user, task]) => {
    if (
      (task.verifier_driver &&
        user.social_providers &&
        user.social_providers.length &&
        user.social_providers.every((item) => item.provider_name !== task.verifier_driver)) ||
      (task.verifier_driver && user.social_providers && !user.social_providers.length) ||
      (task.verifier_driver && !user.social_providers)
    ) {
      isShowSocialConnectModal.value = true;
    }

    console.log('isShowSocialConnectModal', isShowSocialConnectModal);
  },
  { deep: true, instant: true },
);

onMounted(() => {
  if (route.params.id) {
    tasksStore.getTaskAction(route.params.id);
  }
});

const handleClose = (value) => {
  visible.value = value;
};

//make it global
const redirectToPath = (pathTo) => {
  const { href } = router.resolve({ path: `${pathTo}`, base: route.path });
  router.push(href);
};

const takeTask = () => {
  axios
    .get(useRuntimeConfig().public.apiBase + `tasks/take/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.getToken()}`,
      },
    })
    .then(async (res) => {
      await tasksStore.getTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });

      redirectToPath(`/tasks/my-task/${res.data.id}`);

      window.dataLayer.push({
        event: 'talent_task_acceptance',
      });
    })
    .catch((e) => {
      console.log('ERROR', e);
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
    });
};

const closeZoomModal = () => {
  isOpenZoom.value = false;
  document.body.classList.remove('hide-scroll');
};

const zoomInImage = (image) => {
  activeImage.value = image;
  isOpenZoom.value = true;
  document.body.classList.add('hide-scroll');
};

const getUrlList = (images) => {
  return images.map((item) => item.url);
};

const checkIfFilePdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};

const handlePictureCardPreview = async (image) => {
  console.log('image', image);
  if (checkIfFilePdf(image)) {
    window.open(image.url, '_blank');
    return;
  }
};

const toggleWalletConnecting = () => {
  isShowConnectModal.value = !isShowConnectModal.value;
  isShowConnectionModal.value = !isShowConnectionModal.value;
}

const handleWalletConnectionError = () => {
  toggleWalletConnecting()
  isConnectingError.value = !isConnectingError.value;
}

const closeAllWalletModals = () => {
  isShowConnectModal.value = false;
  isShowConnectionModal.value = false;
  isConnectingError.value = false;
  router.push("/projects");
}

const handleSuccessProjectVerification = () => {
  isProjectVerifying.value = false;
  isProjectVerified.value = true;
}

const handleSuccessTaskVerification = () => {
  isTaskVerifying.value = false;
  isTaskVerified.value = true;
}

onUnmounted(() => {
  rewardsArray.value = [];
});

watch(task, (value) => {
  console.log('WATCH task', value);
  getTaskRewards(value);
});

const getCuttencyIcon = (currency) => {
  switch (currency) {
    case 'eth':
      return 'Ethereum1';
    case 'bnb':
      return 'BNB1';
    case 'btc':
      return 'RenBTC1';
    case 'cplt':
      return 'USDT-Circle';
    case 'busd':
      return 'Binance-USD1';
    default:
      return 'USDD-Default';
  }
};

const getTaskRewards = async (task) => {
  if (task.rewards && task.rewards.length) {
    const isCoinsExist = task.rewards.find((reward) => reward.type === 'coins');
    const isCreditsExist = task.rewards.find((reward) => reward.type === 'credits');
    const isDiscordExist = task.rewards.find((reward) => reward.type === 'discord_role');
    if (isCoinsExist && !rewardsArray.value.some((item) => item.type === 'coin')) {
      const icon = getCuttencyIcon(task.coin_type.name);
      const rewardString = `${isCoinsExist.value} ${task.coin_type.symbol.toUpperCase() || task.coin_type.name.toUpperCase()
        }`;
      rewardsArray.value.push({ rewardString, icon, type: 'coin' });
    }
    if (isCreditsExist) {
      if (rewardsArray.value.some((item) => item.type === 'credits')) {
        rewardsArray.value = rewardsArray.value.filter((item) => item.type !== 'credits');
      }
      const icon = creditsIcon;
      const rewardString = `${isCreditsExist.value} Credits`;
      rewardsArray.value.push({ rewardString, icon, type: 'credits' });
    }
    if (isDiscordExist && !rewardsArray.value.some((item) => item.type === 'discord')) {
      try {
        const discordRoles = await useDiscordStore().getDiscordRoleAction(task.project.id);
        const discordData = discordRoles.find((item) => item.id === isDiscordExist.value);
        if (discordData && discordData.name) {
          rewardsArray.value.push({
            rewardString: discordData.name,
            icon: 'Discord-Circle',
            type: 'discord',
          });
        } else {
          rewardsArray.value.push({
            rewardString: 'Discord role',
            icon: 'Discord-Circle',
            type: 'discord',
          });
        }
      } catch (error) {
        console.log('DISCORD ERROR', error);
        rewardsArray.value.push({
          rewardString: 'Discord role',
          icon: 'Discord-Circle',
          type: 'discord',
        });
      }
    }
  }
};

const isPdf = (file) => {
  return file.mime_type.indexOf('pdf') !== -1;
};

const hasHtml = (value) => {
  const regex = /(<([^>]+)>)/gi;
  return regex.test(value);
};

watch(
  task,
  (value) => {
    if (userStore.user.wallet) {
      isShowConnectionModal.value = false;
      isWalletChecked.value = true;
    } else {
      isShowConnectionModal.value = true;
      isWalletChecked.value = false;
    }
  },
  { deep: true }
)

watch(isWalletChecked, (value) => {
  if (value && !task.value.in_work) {
    if (!projectsVerification.includes(task.value.project.id) && task.value.project.conditions.length) {
      isProjectVerifying.value = true;
    } else if (!tasksVerification.includes(+route.params.id) && task.value.chain_conditions.filter(el => el.type === 'gate').length) {
      isTaskVerifying.value = true;
    }
  }
})

watch(
  isProjectVerified,
  (value) => {
    console.log(task.value.chain_conditions.filter(el => el.type === 'gate').length);
    if (value && !tasksVerification.find(el => el === +route.params.id) && task.value.chain_conditions.filter(el => el.type === 'gate').length) {
      isTaskVerifying.value = true;
    }
  },
)
</script>

<style lang="scss" scoped>
.task-connect-social-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 24px;

  &_title {
    display: flex;
    justify-content: center;
    gap: 8px;
    color: var(--secondary-10-mirage, #1a1d29);
    font-variant-numeric: slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
    /* 166.667% */
  }

  &_subtitle {
    color: var(--secondary-10-mirage, #1a1d29);
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    /* 150% */
  }

  &_btn {
    cursor: pointer;
    display: flex;
    height: 40px;
    padding: 7px 24px;
    align-items: center;
    gap: 8px;
    color: var(--Paper, #fff);
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    border-radius: 8px;
    background: var(--primary-50-blaze-orange, #fc660c);
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    /* 150% */
  }

  .icon {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(145deg) brightness(107%) contrast(200%);
  }
}

.discord-card_wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.social-driver_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}

ul,
ol,
menu {
  list-style: disc !important;
  list-style-type: disc !important;
}

.working-talents-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;

  width: 360px;
  // min-height: 416px;
  height: fit-content;

  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;

  &_main-card-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }

  &_users {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &_user {
    width: fit-content;
    height: 40px;
    background: $white;
    padding: 8px 12px;

    border: 1px solid $default-badge-border;
    border-radius: 8px;
  }

  &_btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 12px;
    gap: 8px;
    width: 139px;
    height: 32px;
    background: $transparent-active-bg;
    border-radius: 8px;
    cursor: pointer;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}

.main-task-data {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.task-sidebar-card_reward-amount {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 40px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}

.task-sidebar-card_reward {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-sidebar-review-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $secondary;

  &_wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.task-sidebar-card_subtitle {
  display: flex;
  align-items: center;
  padding: 2px 5px;
  border-radius: 6px;
  border: 1px solid #eaeafb;
  background: #f5f5fd;

  color: #38405b;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
}

.task-sidebar-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $secondary;
}

.task-sidebar-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;
  isolation: isolate;

  width: 360px;
  min-height: 120px;
  height: fit-content;

  background: $white;

  border: 1px solid #dad9f7;
  border-radius: 16px;

  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &_subtitle {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}

.task-images {
  display: flex;
  gap: 16px;
  cursor: pointer;
}

.task-img {
  width: 120px;
  height: 120px;
  background: #eaeafb;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $secondary;
}

.task-content {
  width: 712px;
  height: fit-content;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
  color: $section-title;
  word-break: break-word;
  &.long {
    word-break: break-all;
  }
  // &.list {
  //   padding-left: 22px;
  // }
  // overflow: hidden;
  // &.html {
  //   padding-left: 20px;
  // }
  // ul,
  // ol,
  // menu {
  //   list-style: disc !important;
  //   list-style-type: disc !important;
  // }
}

.task-priority {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid $default-border;
  border-radius: 6px;
  padding: 0 5px;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: #38405b;
}

.task-date {
  display: flex;
  align-items: center;
  gap: 5px;
  color: $section-title;
}

.task-info_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.task-info {
  display: flex;
  gap: 8px;
}

.task_wrapper {
  width: 1160px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
}

.task-name {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}

.task-body {
  width: 100%;
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.task-data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  gap: 24px;

  width: 760px;
  // min-height: 752px;
  height: fit-content;
  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
}

.task-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  max-width: 360px;
  width: 100%;
  height: 100%;
}
.html {
  word-break: break-word;
}
</style>
