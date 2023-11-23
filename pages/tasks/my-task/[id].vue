<template>
  <div v-if="task" class="task_wrapper">
    <BtnSkeleton v-if="userTaskLoading" />
    <BackBtn
      v-else
      :text="task.task.project.name"
      :img="task.task.project.logo"
      :to="`/tasks?status=${task.status}`"
    />
    <BtnSkeleton v-if="userTaskLoading" />
    <div v-else class="task-name">{{ task.task.name }}</div>
    <div class="task-body">
      <TableSkeleton v-if="userTaskLoading" />

      <div v-else class="task-data">
        <div class="main-task-data">
          <div class="task-info_header-wrapper">
            <div class="task-info_wrapper">
              <div class="task-info">
                <Badge
                  :text="task.task.activity ? task.task.activity.name : 'All'"
                  :type="getBadgeTypeByName(task.task.activity ? task.task.activity.name : 'All')"
                  :big="false"
                />
                <div class="task-priority">Priority <Priority :dots="task.task.priority" /></div>
                <div class="task-date">
                  <Badge
                    :text="formatDate(timestampToString(task.task.started_at))"
                    type="transparent"
                    :big="false"
                  />
                  -
                  <Badge
                    :text="formatDate(timestampToString(task.task.ended_at))"
                    type="transparent"
                    :big="false"
                  />
                </div>
              </div>
              <div class="task-status">
                <!-- <Badge
                  :text="getTaskStatus(task.status)"
                  isStatusIcon
                  type="transparent"
                  :big="false"
                /> -->
                <TaskStatusNew :status="task.status"></TaskStatusNew>
              </div>
            </div>
            <div
              v-if="task.task.verifier_driver && task.task.verifier_driver === 'twitter'"
              class="social-driver_title"
            >
              Twitter Activities to Complete the Task
            </div>
            <TwitterCard
              v-if="task.task.verifier_driver && task.task.verifier_driver === 'twitter'"
              small
              :task="task.task"
              :allTask="task"
              :status="task.status"
              isFollow
            />
            <TwitterCard
              v-if="task.task.verifier_driver && task.task.verifier_driver === 'twitter'"
              :task="task.task"
              :allTask="task"
              :status="task.status"
              isShowBtns
              isPost
            />
            <TwitterCard
              v-if="
                task.task.verifier_driver &&
                task.task.verifier_driver === 'twitter' &&
                task.task.verifier.types.some((item) => item === 'twitter_tweet')
              "
              :task="task.task"
              :allTask="task"
              :status="task.status"
              isTweetLink
              :isTweetLinkActive="task.status === 'in_progress'"
              @urlInput="handleUrl"
            />
            <TwitterCard
              v-if="
                task.task.verifier_driver &&
                task.task.verifier_driver === 'twitter' &&
                task.task.verifier.types.some((item) => item === 'twitter_space')
              "
              :task="task.task"
              :allTask="task"
              :status="task.status"
              isSpace
            />
            <DiscordCard
              v-if="task.task.verifier_driver && task.task.verifier_driver === 'discord'"
              :task="task.task"
            />
            <TelegramCard
              v-if="task.task.verifier_driver && task.task.verifier_driver === 'telegram'"
              :task="task.task"
            />
            <div v-if="task.task.is_invite_friends && !isEditingActive" class="social-driver_title">
              Invite {{ task.task.number_of_invites }} Talents to the Project to Complete the Task.
            </div>
            <TaskInvitesCard
              v-if="task.task.is_invite_friends"
              :description="task.task.project.description"
              :protocol="task.task.project.name"
              :tags="task.task.project.tags"
              :bg="task.task.project.banner"
              :logo="task.task.project.logo"
              :task="task"
              :status="task.status"
            />
          </div>
          <div
            v-if="task.task.verifier_driver && task.task.verifier_driver === 'reddit'"
            class="flex gap-4"
            style="flex-direction: column"
          >
            <RedditPostCard
              class="mb-5"
              v-if="
                task.task.verifier.types.includes('reddit_comment_post') ||
                task.task.verifier.types.includes('reddit_save_post') ||
                task.task.verifier.types.includes('reddit_vote_post')
              "
              :is-comment="task.task.verifier.types.includes('reddit_vote_post')"
              :is-save="task.task.verifier.types.includes('reddit_save_post')"
              :is-vote="task.task.verifier.types.includes('reddit_vote_post')"
              :verifiers="task.reddit_verifiers"
              :url="task.task.verifier.reddit_post"
              :id="task.task.verifier.reddit_post_id"
            ></RedditPostCard>
            <RedditCommunityCard
              class="mb-5"
              v-if="
                task.task.verifier.types.includes('reddit_join_community') ||
                task.task.verifier.types.includes('reddit_own_post')
              "
              :is-community="task.task.verifier.types.includes('reddit_join_community')"
              :is-own-post="task.task.verifier.types.includes('reddit_own_post')"
              :words="task.task.verifier.reddit_post_words"
              :post="task.task.verifier.reddit_default_post"
              :verifiers="task.reddit_verifiers"
              :url="task.task.verifier.reddit_community"
              :id="task.task.verifier.reddit_community_id"
            ></RedditCommunityCard>
            <RedditKarmaCard
              class="mb-5"
              :karma="task.task.verifier.reddit_karma_score"
              :verifiers="task.reddit_verifiers"
              v-if="task.task.verifier.types.includes('reddit_karma_score')"
            ></RedditKarmaCard>
            <RedditTrophiesCard
              class="mb-5"
              :trophies="task.task.verifier.reddit_trophies"
              :verifiers="task.reddit_verifiers"
              v-if="task.task.verifier.types.includes('reddit_trophies')"
            ></RedditTrophiesCard>
          </div>
          <div class="task-content" v-if="!hasHtml(task.task.text)">
            {{ task.task.text }}
          </div>
          <div
            class="task-content html"
            :class="{
              list: isTaskHasList(task.task.text),
              long: isTaskHasLongWord(task.task.text),
            }"
            v-else
            v-html="addLinksToText(task.task.text)"
          ></div>
        </div>
        <FileListViewer
          v-if="task.task.images.length"
          @zoomInImage="zoomInImage"
          :files="task.task.images"
        />

        <TaskCondition v-if="taskChainCondition" :condition="taskChainCondition" :isInWork="true" :taskId="task.task.id" 
          :verification="task.verification" @pending="handlePendingVerification" @success="handleSuccessVerification" />
      </div>
      <CalendarSkeleton v-if="userTaskLoading" />

      <div v-else class="task-sidebar-review">
        <div v-if="rewardsArray.length" class="task-sidebar-review-card">
          <div class="task-sidebar-review-card_title_wrapper">
            <div class="task-sidebar-review-card_title">Rewards</div>

            <div
              v-if="rewardsArray.some((item) => item.type === 'coin')"
              class="task-sidebar-card_subtitle flex items-center gap-x-1"
            >
              <Blockchain :name="task.task.coin_type.blockchain.name" :size="18"></Blockchain>

              <span>{{ task.task.coin_type.blockchain.name }}</span>
            </div>
          </div>

          <div
            v-for="taskReward in rewardsArray"
            :key="taskReward.rewardString"
            class="task-sidebar-review-card_reward"
          >
            <div class="task-sidebar-review-card_reward-amount">{{ taskReward.rewardString }}</div>
            <img v-if="taskReward.type === 'credits'" :src="taskReward.icon" alt="" />
            <Coin
              v-if="taskReward.type === 'coin'"
              :name="task.task.coin_type.symbol + '-Default'"
              :size="36"
            />
            <Icon v-else :name="taskReward.icon" :size="36" />
          </div>
        </div>

        <div
          v-if="task.status === 'available' && task.status.length"
          class="working-talents-card-review"
        >
          <div class="working-talents-card-review_main-card-content">
            <div class="working-talents-card-review_title">Working Talents</div>
            <div v-if="task.task.assigned_users.length" class="working-talents-card-review_users">
              <div
                v-for="user in task.task.assigned_users"
                :key="user.id"
                class="working-talents-card-review_user"
              >
                <Talent :text="user.name" />
              </div>
            </div>
          </div>
          <div
            v-if="task.task.assigned_users.length"
            @click="visible = true"
            class="working-talents-card-review_btn"
          >
            View all
            {{ task.task.assigned_users.length ? task.task.assigned_users.length : 0 }} talents
          </div>
        </div>

        <ReportsCard
          v-if="!isTaskInProgress && task.reports && task.reports.length"
          :reports="task.reports"
          :status="task.status"
          :created="timestampToString(task.task.started_at)"
        />
        <BaseButton
          v-if="
            !taskChainCondition &&
            (isTaskInProgress &&
              !task.task.is_invite_friends &&
              !task.task.autovalidate) ||
            (task.status === 'returned' && !task.task.is_invite_friends && !task.task.autovalidate)
          "
          class="w-full"
          :text="isTaskInProgress ? 'Complete Task' : 'Resend for Review'"
          type="normal"
          @click="visible = true"
        />
        <BaseButton
          v-if="
            (taskChainCondition && isTaskInProgress) ||
            (!taskChainCondition && isTaskInProgress && task.task.is_invite_friends) ||
            (!taskChainCondition && isTaskInProgress && task.task.autovalidate)
          "
          class="w-full claim-button"
          :text="'Claim Reward'"
          type="normal"
          :loadingAnimation="claimLoading"
          loadingText="Waiting"
          @click="handleClaim"
          :disabled="!claimStatus || !claimChainStatus"
          :tooltipLeftPosition="'-64px'"
          :isTooltipActive="!claimStatus || !claimChainStatus"
          tooltipText="Wait for verification to complete"
        />
      </div>
    </div>
  </div>
  <ZoomImage v-if="isOpenZoom" @close="closeZoomModal" :image="activeImage" />

  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleClose($event)"
    :visible="visible"
    btnLeft
  >
    <CompleteTaskModal @close="visible = false" :taskId="taskId" />
  </BaseModal>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleReworkModalClose($event)"
    :visible="isReworkModalVisible"
    btnLeft
  >
    <ReworkModal @input="setReturnTaskDescription($event)" @action="returnTask" />
  </BaseModal>
  <BaseModal
    :width="480"
    customHeight="248px"
    @close="handleCloseConfirm($event)"
    :visible="isConfirmModalOpen"
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Decision</div>
      <div class="confirm-modal_subtitle">
        Confirm this decision is rejected if you think the talent has not completed the task
        correctly.
      </div>

      <div class="confirm-modal_btns-wrapper">
        <BaseButton text="Cancel" type="secondary" @click="handleCloseConfirm(false)" />
        <BaseButton text="Reject" type="normal" @click="rejectTask" />
      </div>
    </div>
  </BaseModal>

  <InaccessibleLinkModal
    v-if="showErrorModal"
    title="Task Unavailable"
    text="The task you are trying to access is no longer available. It may have been completed or deleted. Please contact your project manager or administrator for further assistance."
    link="/tasks?status=in_progress"
    button="Go to the List of Tasks"
  ></InaccessibleLinkModal>
</template>

<script setup>
import {
  formatDate,
  getBadgeTypeByName,
  isTaskHasList,
  timestampToString,
  isTaskHasLongWord,
  addLinksToText,
} from '@/util/helpers';

import { useRoute } from 'vue-router';
import { onMounted, ref, onUnmounted } from 'vue';
import { useTasksStore } from '~/store/tasks';
import { useDiscordStore } from '~/store/discord';
import axios from 'axios';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import creditsIcon from '@/assets/icons/Credits.svg';
import { claimReward } from '../utils';

const router = useRouter();
const nuxtApp = useNuxtApp();

const route = useRoute();
const tasksStore = useTasksStore();
const discordStore = useDiscordStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const rewardsArray = ref([]);
const rating = ref(null);
const userTweet = ref('');
const claimLoading = ref(false);
const showErrorModal = ref(false);

const setRating = (value) => {
  rating.value = value;
};

const task = computed(() => tasksStore.getUserTask);
const claimStatus = computed(() => tasksStore.getClaimStatus || task.value.can_be_claimed);
const taskId = computed(() => tasksStore.getUserTask.id);
const user = computed(() => userStore.getUser);

console.log('task', task);

onMounted(() => {
  if (route.params.id) {
    tasksStore.getUserTaskAction(route.params.id).catch(() => (showErrorModal.value = true));
  }
});

const userTaskLoading = computed(() => tasksStore.getUserTaskLoading);
const userTaskLoaded = computed(() => tasksStore.getUserTaskLoaded);
const taskChainCondition = computed(() => task.value.task.chain_conditions.find((el) => el.type === "main")); 

const visible = ref(false);
const isConfirmModalOpen = ref(false);
const isApproveModalOpen = ref(false);
const isReworkModalVisible = ref(false);
const returnTaskDescription = ref('');
const activeImage = ref(null);
const isOpenZoom = ref(false);
const isChainConditionCompleted = ref(false);

const claimChainStatus = computed(() => {
  return taskChainCondition.value && isChainConditionCompleted.value;
});
const isTaskInProgress = computed(() => {
  return task.value.status === 'in_progress'
}) 

const handleUrl = (url) => {
  console.log('handleUrl url', url);
  userTweet.value = url;
};

const handleClaim = () => {
  if (!claimStatus.value || !claimChainStatus.value) {
    
    return;
  } else {
    claimLoading.value = true;
    const data = {};
    claimReward(taskChainCondition.value, route.params.id, authStore.getToken())
      .then((response) => {
        tasksStore.getUserTaskAction(taskId.value);
        userStore.userInfo();
        nuxtApp.$alert.show(`Success`, {
          type: 'success',
          timeout: 5000,
        });
        claimLoading.value = false;
      })
      .catch((error) => {
        claimLoading.value = false;

        console.log(error);
        if (error.response.data.errors) {
          const parseErrors = Object.values(error.response.data.errors);
          parseErrors.forEach((errorItem) => {
            nuxtApp.$alert.show(errorItem.join('\n'), {
              type: 'error',
              timeout: 5000,
            });
          });
        } else if (error.response.data.message) {
          nuxtApp.$alert.show(error.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        } else {
          nuxtApp.$alert.show(error.message, {
            type: 'error',
            timeout: 5000,
          });
        }
      });
  }
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

const setReturnTaskDescription = (value) => {
  returnTaskDescription.value = value;
};

const handleClose = (value) => {
  visible.value = value;
};

const handleCloseApprove = (value) => {
  isApproveModalOpen.value = value;
};

const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};

const handleReworkModalClose = (value) => {
  isReworkModalVisible.value = value;
};

const returnTask = () => {
  if (!returnTaskDescription.value.length) {
    nuxtApp.$alert.show(`Fill the message`, {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  axios
    .post(
      useRuntimeConfig().public.apiBase + 'ambassadors/tasks/return/' + route.params.id,
      {
        text: returnTaskDescription.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      tasksStore.getUserTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });
      isReworkModalVisible.value = false;
    })
    .catch((error) => {
      nuxtApp.$alert.show(`Something went wrong!`, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
    });
};

const rejectTask = () => {
  axios
    .post(
      useRuntimeConfig().public.apiBase + 'ambassadors/tasks/reject/' + route.params.id,
      {
        ambassadorTask: route.params.id,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      tasksStore.getUserTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });
      isConfirmModalOpen.value = false;
    })
    .catch((error) => {
      nuxtApp.$alert.show(`Something went wrong!`, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
    });
};

const finishTask = () => {
  if (!rating.value) {
    nuxtApp.$alert.show(`Please select rating`, {
      type: 'error',
      timeout: 5000,
    });

    return;
  }

  axios
    .post(
      useRuntimeConfig().public.apiBase + 'ambassadors/tasks/done/' + route.params.id,
      { rating: rating.value },
      {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      },
    )
    .then((response) => {
      tasksStore.getUserTaskAction(route.params.id);
      nuxtApp.$alert.show(`Success`, {
        type: 'success',
        timeout: 5000,
      });
      isApproveModalOpen.value = false;
    })
    .catch((error) => {
      nuxtApp.$alert.show(`Something went wrong!`, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
    });
};

const statusHandler = (status) => {
  if (status === 'waiting_for_review') {
    axios
      .post(
        useRuntimeConfig().public.apiBase + 'ambassadors/tasks/take-on-revision/' + route.params.id,
        {},
        {
          headers: {
            Authorization: `Bearer ${authStore.getToken()}`,
          },
        },
      )
      .then((response) => {
        tasksStore.getUserTaskAction(route.params.id);
        nuxtApp.$alert.show(`Success`, {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((error) => {
        nuxtApp.$alert.show(`Something went wrong!`, {
          type: 'error',
          timeout: 5000,
        });
        console.log(error);
      });
  }
  if (status === 'on_revision') {
    isApproveModalOpen.value = true;
  }
};

onBeforeUnmount(() => {
  rewardsArray.value = [];
  tasksStore.destroyTask();
  console.log(task.value);
});
watch(task, (value) => {
  console.log('WATCH task mine', value);
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
  if (task.task.rewards && task.task.rewards.length) {
    const isCoinsExist = task.task.rewards.find((reward) => reward.type === 'coins');
    const isCreditsExist = task.task.rewards.find((reward) => reward.type === 'credits');
    const isDiscordExist = task.task.rewards.find((reward) => reward.type === 'discord_role');
    if (isCoinsExist && !rewardsArray.value.some((item) => item.type === 'coin')) {
      const icon = getCuttencyIcon(task.task.coin_type.name);
      const rewardString = `${isCoinsExist.value} ${
        task.task.coin_type.symbol.toUpperCase() || task.task.coin_type.name.toUpperCase()
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
        const discordRoles = await useDiscordStore().getDiscordRoleAction(task.task.project.id);
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
        // rewardsArray.value.push({
        //   rewardString: discordData.name,
        //   icon: 'Discord-Circle',
        //   type: 'discord',
        // });
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

const handlePendingVerification = (value) => {
  if (value) {
    const task = setTimeout(() => {
      tasksStore.updateUserTaskAction(route.params.id).catch(() => (showErrorModal.value = true));
    }, 5000);
  }
}

const handleSuccessVerification = (value) => {
  if (value) {
    isChainConditionCompleted.value = true;
  }
}
</script>

<style lang="scss" scoped>
.social-driver_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
.confirm-modal {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  &_subtitle {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  &_btns-wrapper {
    width: 100%;
    display: flex;
    gap: 24px;
  }
}
.reject-btns {
  display: flex;
  gap: 16px;
}
.approve-btn_wrapper {
  width: 160px;
  height: 40px;
  margin-top: 30px;
}
.approve-task-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  gap: 24px;
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: #1a1d29;
  }
  &_subtitle {
    width: 336px;
    height: 48px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #1a1d29;
  }
}
.working-talents-card-review {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;

  width: 360px;
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
.task-sidebar-review-card_reward-amount {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 32px;
  line-height: 40px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
.task-sidebar-review-card_reward {
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

.task-sidebar-review-card {
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
}
.task-images {
  display: flex;
  gap: 16px;
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
  img {
    width: 100%;
    height: 100%;
  }
}
.task-content {
  width: 712px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  hanging-punctuation: first last;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
  color: $section-title;

  &.list {
    padding-left: 22px;
  }
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
  &_header-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
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
  height: fit-content;
  background: $white;

  border: 1px solid $default-border;
  border-radius: 16px;
}
.task-sidebar-review {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 360px;
  width: 100%;
  height: 100%;
}
.html {
  word-break: break-word;
}

.claim-button {
  color: #AAA7CC!important;
  .tooltip-component {
    left: 60px;
  }
}
</style>
