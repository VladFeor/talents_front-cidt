<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <PageToggle
        :buttons="[{ title: 'Leaderboard', id: 0 }]"
        :id="0"
        @select="setIsShowEvents($event)"
      />
    </div>

    <div class="tasks-body">
      <Leaderboard v-if="id === 0" />
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '~/store/dashboard';
import { ref, onMounted } from 'vue';

onMounted(() => {
  dashboardStore.getDashboardAction();
});

const dashboardStore = useDashboardStore();

const id = ref(0);

function setIsShowEvents(idProp) {
  id.value = idProp;
}
</script>

<style lang="scss" scoped>

.tasks-container {
  display: flex;
  justify-content: center;
  //   align-items: center;
  flex-direction: column;
  //   width: 100%;
  max-width: 1160px;
  margin: 0 auto;
}
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}
.tasks-modify {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
</style>
