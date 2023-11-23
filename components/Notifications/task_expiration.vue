<template>
  <div class="task">
    <Talent :text="data.project_name" square :img="data.project_avatar"></Talent>
    <div class="title">{{ data.task_name }}</div>
    <div class="footer">
      <TaskStatusNew :status="data.task_status_from"></TaskStatusNew>
      <Icon name="Right-Arrow" :size="16" />
      <TaskStatusNew status="overdue"></TaskStatusNew>
    </div>
  </div>
</template>
<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  task: {
    type: Object,
    default: () => {
      return {
        name: 'Test',
        deadline: '5 days',
      };
    },
  },
});
</script>
<style scoped lang="scss">
.task {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  .title {
    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
  .footer {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
