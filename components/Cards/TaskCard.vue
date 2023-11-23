<template>
  <div v-if="task" ref="cardRef" class="task-card" @click="toHandler" :class="{ [task.personalColor]: isPersonalTask }">
    <div class="task-title">
      <component :is="task.project.component" :="task.project.props" />
      <div class="direction_wrapper">
        <component :is="task.direction.component" :="task.direction.props" />
        <Icon v-if="isPersonalTask" name="Crown" :size="24" />
      </div>
    </div>
    <div class="task-name">{{ reduceStringLength(task.task.content, 34) }}</div>
    <component :is="task.multiRewards.component" :="task.multiRewards.props" />
    <div class="task-footer">
      <div v-if="!userTask" class="task-time">
        <component :is="task.start.component" :="task.start.props" />
        <span>-</span>
        <component :is="task.deadline.component" :="task.deadline.props" />
      </div>
      <div v-else class="task-deadline">
        <span v-if="isOverdue">Deadline</span>
        <component v-if="isOverdue" :is="task.deadline2.component" :="task.deadline2.props" />
        <div v-else-if="isEarned" class="task-time">
          <component :is="task.start.component" :="task.start.props" />
          <span>-</span>
          <component :is="task.deadline2.component" :="task.deadline2.props" />
        </div>
        <div v-else-if="isReturned" class="task-deadline">
          <span>Deadline in</span>
          <component :is="task.deadlineReturned.component" :="task.deadlineReturned.props" />
        </div>
        <div v-else-if="isInProgress || isWaiting" class="task-deadline">
          <span>Deadline in</span>
          <component :is="task.deadline2.component" :="task.deadline2.props" />
        </div>
        <div v-else class="task-deadline">
          <span>Deadline in</span>
          <component :is="task.deadline.component" :="task.deadline.props" />
        </div>
      </div>
      <div class="earned">
        <component v-if="!isOverdue" :is="task.priority.component" :="task.priority.props" />
        <component v-if="userTask && isEarned" :is="task.earned_points.component" :="task.earned_points.props" card />
        <component v-if="userTask && isOverdue" :is="task.badge.component" :="task.badge.props" card />
      </div>
    </div>
    <BaseModal :visible="isProjectVerifying" :width="520" :isCloseBtnInvisible="true">
      <GateVerificationModal :isVerified="isProjectVerified" :type="'project'" :data="task.project.props"
        :isSuccessSkipped="true" @success="handleSuccessProjectVerification" @cancel="isProjectVerifying = false" />
    </BaseModal>
    <BaseModal :visible="isVerifying" :width="520" @close="isVerifying = false">
      <GateVerificationModal :isVerified="isVerified" :type="'task'" :data="task" @success="handleSuccessTaskVerification"
        @cancel="isVerifying = false" />
    </BaseModal>
  </div>
</template>

<script setup>
import { reduceStringLength } from '@/util/helpers';
import { useRouter } from 'vue-router';
import { useUserStore, useProjectsStore } from '~/store';

const router = useRouter();

const props = defineProps({
  task: { type: Object, default: null },
  userTask: { type: Boolean, default: false },
  isEarned: { type: Boolean, default: false },
  isOverdue: { type: Boolean, default: false },
  isInProgress: { type: Boolean, default: false },
  isReturned: { type: Boolean, default: false },
  isWaiting: { type: Boolean, default: false },
  isPersonalTask: { type: Boolean, default: false },
  to: { type: String, default: '' },
});

const emit = defineEmits(['connectWallet'])

const userStore = useUserStore();
const projectsStore = useProjectsStore();

const isGatedTask = computed(() => !!(props.task.chainConditions && props.task.chainConditions.filter(el => el.type === 'gate')?.length));
const isGatedProject = computed(() => !!props.task.project?.props?.conditions?.length);

const isProjectVerified = ref(!isGatedProject);
const isProjectVerifying = ref(false);
const isVerified = ref(!isGatedTask);
const isVerifying = ref(false);

const cardRef = ref(null);

const toHandler = (e) => {

  if (e && !cardRef.value.contains(e?.target)) return; //workaround for modal closing constantly calling this method
  if (props.task?.workingUsers?.find(el => el.id === userStore.user.id)) {
    router.push(props.task.to);
    return
  }
    
  if ((isGatedTask.value || isGatedProject.value) && !userStore.user.wallet) {
    emit('connectWallet', true);
    return
  }

  if (isGatedProject.value && !isProjectVerified.value) {
    isProjectVerifying.value = true
    return
  }

  if (isGatedTask.value && !isVerified.value && !projectsStore.verifiedTasks.includes(props.task.id)) {
    isVerifying.value = true;
    return
  }

  if (props.task.to) {
    router.push(props.task.to);
  }
};

const handleSuccessProjectVerification = () => {
  isProjectVerifying.value = false;
  isProjectVerified.value = true;
  toHandler();
}

const handleSuccessTaskVerification = () => {
  isVerified.value = true
  toHandler();
}

watch(isProjectVerified, (value) => {
  if (value && isGatedTask.value && !projectsStore.verifiedTasks.includes(props.task.id)) {
    isVerifying.value = true;
  }
})
</script>

<style lang="scss" scoped>
.direction_wrapper {
  display: flex;
  gap: 12.15px;
}

.earned {
  display: flex;
  align-items: center;
  gap: 7px;
}

.task-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
}

.task-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 376px;
  height: 232px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;

  @media screen and (max-width: 1440px) {
    width: 100%;
    max-width: 32.3%;
    min-width: 300px;
  }

  &.social_influence {
    border: 2px solid #3ea33b;

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.testing {
    border: 2px solid #a37800;

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.development {
    border: 2px solid #d64d69;

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.design {
    border: 2px solid #a94dd6;

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.content_making {
    border: 2px solid #25b8ae;

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.copywriting {
    border: 2px solid #4979cc;

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.isPersonalTask {
    border: 2px solid rgba(252, 102, 12, 1);

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &.all {
    border: 2px solid rgba(252, 102, 12, 1);

    &:hover {
      cursor: pointer;
      border: 2px solid $default;
    }
  }

  &:hover {
    cursor: pointer;
    border: 1px solid $default;
  }
}

.task-title {
  display: flex;
  justify-content: space-between;
}

.task-name {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $default;
}

.task-time {
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    color: $colabs-bg;
  }
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
