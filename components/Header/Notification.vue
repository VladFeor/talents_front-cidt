<template>
  <div
    class="notification-card cursor-pointer"
    @mouseover="showText = true"
    @mouseleave="showText = false"
    @click="redirect()"
  >
    <div class="wrapper">
      <div
        class="image"
        :style="`background: url(${isProject ? logo : defaultBg}) no-repeat; border-radius: ${
          isProject ? '8px' : '32px'
        }`"
        style="background-size: cover"
      ></div>
      <div class="content">
        <div class="time" @click.stop="showText && !read ? $emit('read') : () => {}">
          {{ diffTime }}
          <div :class="computedIsReadedClass"></div>
          <div v-if="showText && !read" class="mark cursor-pointer" @click.stop="$emit('read')">
            Mark as read
          </div>
        </div>
        <div v-html="title" class="title"></div>
        <div class="component" :class="{ 'component-active': showText }" v-if="!isEmptySlot">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/talentumAvatar.svg';
const router = useRouter();

const props = defineProps({
  logo: {
    type: String,
    default: defaultBg,
  },
  data: {
    type: Object,
    default: () => {},
  },
  time: {
    type: String,
    default: '2023-07-26T14:25:08.000000Z',
  },
  isEmptySlot: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  read: {
    type: Boolean,
    default: false,
  },
  isProject: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['read']);

const redirect = () => {
  emit('read');
  if (!props.isEmptySlot) {
  if (props.data.project_id && !props.data.task_id) {
    router.push(`/projects/${props.data.project_id}`);
  } else if (props.data.task_id) {
    router.push(
      props.data.type !== 'user_task' && props.data.type !== 'user_task_verification'
        ? `/tasks/task/${props.data.task_id}`
        : `/tasks/my-task/${props.data.task_id}`,
    );
  } else if (props.data.activity) {
    router.push(`/profile`);
  } else {
    router.push(`/inner-wallet`);
  }
  }
};

const computedIsReadedClass = computed(() => {
  return props.read || (!props.read && showText.value) ? 'read' : 'unread';
});

const now = ref(new Date());
const showText = ref(false);

const diffTime = computed(() => {
  const endDate = new Date(props.time);
  const diffMilliseconds = now.value.getTime() - endDate.getTime();

  if (diffMilliseconds < 0) {
    return 'Moment ago';
  }

  const diffSeconds = diffMilliseconds / 1000;
  const minutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? 'a year ago' : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? 'a month ago' : `${months} months ago`;
  } else if (weeks > 0) {
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? 'a day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  } else if (minutes < 1) {
    return 'moment ago';
  } else {
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  }
});
</script>
<style scoped lang="scss">
.notification-card {
  width: 100%;
  height: fit-content;

  &:hover {
    background: $transparent-active-bg;
  }

  .wrapper {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
  }

  .image {
    display: flex;
    width: 40px;
    min-width: 40px;
    height: 40px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    .time {
      color: $secondary;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0.168px;
      display: flex;
      align-items: center;
      .unread {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: $orange;
        margin-left: 12px;
        margin-right: 6px;
      }
      .read {
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: $default;
        margin-left: 12px;
        margin-right: 6px;
      }
      .mark {
        color: $default;
      }
    }
    .title {
      color: $secondary;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }
    .component {
      display: flex;
      padding: 8px;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid $default-badge-border;
      background: $default-bg;
      &-active {
        border: 1px solid $default-border;
      }
    }
  }
}
</style>