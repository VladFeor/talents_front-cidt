<template>
  <div class="small-profile">
    <img class="avatar" :src="data.avatar || defaultBg" />
    <div class="info">
      <div class="name">{{ reduceStringLength(data.name, 20) }}</div>
      <SetProgress
        :percentage="`${
          userLevel.progress > userLevel.total ? 100 : (userLevel.progress * 100) / userLevel.total
        }`"
        small
      ></SetProgress>
      <div class="level-info">
        <span>Level {{ data.level }}</span
        ><span>{{ data.total_points }} QP</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reduceStringLength } from '@/util/helpers';
import defaultBg from '@/assets/images/default-avatar.png';
import { computed } from 'vue';
import { useDashboardStore } from '~/store';
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const dashboardStore = useDashboardStore();
const userStat = computed(() => dashboardStore.getDashboardOverview);
const userLevel = computed(() => {
  if (Object.keys(userStat.value).length) {
    console.log('userStat.value', userStat.value);
    return {
      level: userStat.value.level_data.level,
      totalPoints: userStat.value.level_data.points,
      nextLevel: userStat.value.level_data.next_level,
      total: userStat.value.level_data.need_points,
      progress: userStat.value.level_data.points,
    };
  } else return null;
});
</script>
<style scoped lang="scss">
.small-profile {
  display: flex;
  padding: 16px;
  width: 100%;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid $default-badge-border;
  background: $white;
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50px;
  }
  .info {
    display: flex;
    flex-direction: column;
    width: 100%;
    .name {
      color: $section-title;
      font-variant-numeric: slashed-zero;
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 40px; /* 166.667% */
    }
    .level-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: $colabs-bg;
        text-align: right;
        font-variant-numeric: slashed-zero;
        font-family: 'Basis Grotesque Pro';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px; /* 142.857% */
      }
    }
  }
}
</style>
