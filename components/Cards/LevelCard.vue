<template>
  <div class="level-card" v-if="data">
    <div class="title-block">
      <div class="level">Level {{ data.level }}</div>
      <div class="point">
        {{ data.totalPoints }} QP
        <TooltipIcon tooltipText="QP(Quality Points) earn by completing tasks" isLeft />
        <!-- <Icon class="Vector"></Icon> -->
      </div>
    </div>
    <div class="box">
      <div
        class="progress"
        :style="`width: ${data.progress > data.total ? 100 : (data.progress * 100) / data.total}%`"
      ></div>
    </div>
    <div class="description" v-show="data.nextLevel && hasDirections">
      Waiting for manager to update
    </div>
    <div class="description" v-show="data.nextLevel && !hasDirections">
      Waiting for direction approval
    </div>
    <div class="zero-description" v-show="data.level == 0 && data.progress == 0">
      Take your first task in work!
    </div>
    <div class="zero-description" v-show="!data.nextLevel && data.progress != 0">
      {{ data.total - data.progress }} QP left until the next level
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '~/store/user';
const userStore = useUserStore();

const hasDirections = computed(() => {
  return userStore.getUser.activities.find((i) => i.status === 'approved');
});
</script>
<script>
export default {
  name: 'LevelCard',
  props: {
    level: {
      type: Number,
      default: 1,
    },
    progress: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    nextLevel: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped lang="scss">
.level-card {
  padding: 14px;
  width: 100%;
  border: 1px solid $default-border;
  background: $white;
  border-radius: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  flex-direction: column;
  min-height: 120px;
  .title-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .level {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      color: $default;
    }
    .point {
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      text-align: right;
      color: $default;
    }
  }
  .box {
    margin-bottom: 20px;
    background: $default-bg;
    border: 1px solid $default-badge-border;
    border-radius: 16px;
    padding: 2px;
    .progress {
      height: 12px;
      background: linear-gradient(90deg, #fc660c 0%, #ff9844 100%);
      border-radius: 16px;
    }
  }
  .description {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    color: $orange;
  }
  .zero-description {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    color: $secondary;
  }
  .progress-description {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    color: $secondary;
  }
}
</style>
