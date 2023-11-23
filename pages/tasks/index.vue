<template>
  <div class="tasks-container">
    <div class="tasks-header">
      <PageToggle
        :buttons="[
          { title: 'Tasks', id: 0 },
          { title: 'My Tasks', id: 1 },
        ]"
        :id="taskTabId"
        @select="setIsShowEvents($event)"
      />
      <div v-if="id === 0" class="tasks-modify">
        <InputWithSearch
          :placeholder="'Find a Task...'"
          :iconSize="24"
          v-model="pagData.search"
          :intervalFunc="searchTasks"
        />
      </div>
    </div>
    <div class="tasks-body" v-if="renderComponent">
      <Tasks @pagData="setPagData($event)" v-if="id === 0" :search="pagData.search" />
      <UserTasks v-else />
    </div>
  </div>
</template>

<script setup>
import { useTasksStore } from '~/store/tasks';
import { useUserStore } from '~/store';
import { useDashboardStore } from '~/store/dashboard';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, reactive } from 'vue';
import axiosService from '~/service/axiosService';
const nuxtApp = useNuxtApp();

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

onMounted(() => {
  dashboardStore.getDashboardAction();
  if (route.query && route.query.status) {
    id.value = 1;
    taskTabId.value = 1;
    overviewStatus.value = route.query.status;
  }
  if (!route.query) {
    setIsShowEvents(0);
  }

  const isTG = window.location.href.match(/[#\?\&]tgAuthResult=([A-Za-z0-9\-_=]*)$/);
  if (localStorage.social && route.query && !isTG) {
    const query = Object.entries(route.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    axiosService
      .get(useRuntimeConfig().public.apiBase + `auth/${localStorage.social}/callback/?${query}`)
      .then(async () => {
        await userStore.userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      })
      .finally(() => {
        localStorage.social = '';
      });
  } else if (localStorage.social && isTG) {
    axiosService
      .get(
        useRuntimeConfig().public.apiBase +
          `auth/${localStorage.social}/callback/?tgAuthResult=${isTG[1]}`,
      )
      .then(async () => {
        await userStore.userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';

        if (e.response.data && !e.response.data.connectionStatus) {
          showModalError.value = true;
          tgAccessTime.value = e.response.data.connection_available_at;
        }
      })
      .finally(() => {
        localStorage.social = '';
      });
  }
});

const tasksStore = useTasksStore();
const dashboardStore = useDashboardStore();

const searchInterval = ref(null);
const id = ref(0);
const taskTabId = ref(0);
const overviewStatus = ref(false);

provide('overviewStatus', overviewStatus);

const pagData = reactive({
  status: 'available',
  page: 1,
  search: '',
});

const setPagData = (data) => {
  pagData.status = data.status;
  pagData.page = data.page;
  pagData.search = data.search;
  if (data.reward_type) {
    pagData.reward_type = data.reward_type;
  } else {
    pagData.reward_type = '';
  }
  if (data.priority) {
    pagData.priority = data.priority;
  } else {
    pagData.priority = '';
  }
  if (data.activity_id) {
    pagData.activity_id = data.activity_id;
  } else {
    pagData.activity_id = '';
  }
  if (data.project_id) {
    pagData.project_id = data.project_id;
  } else {
    pagData.project_id = '';
  }
  if (data.types) {
    pagData.types = data.types;
  } else {
    pagData.types = '';
  }
};

const searchTasks = () => {
  clearTimeout(searchInterval.value);
  searchInterval.value = setTimeout(() => {
    tasksStore.getTasksAction(pagData);
  }, 500);
};
const renderComponent = ref(true);

function setIsShowEvents(idProp) {
  id.value = idProp;
  taskTabId.value = idProp;
  overviewStatus.value = false;
  pagData.search = '';
  router.push(`tasks?tab=${idProp}`);
}
const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
watch(
  () => route.query.tab,
  (value) => {
    if (value) {
      forceRender();
      setIsShowEvents(+value);
    }
  },
);

watch(
  () => route.query.status,
  (value) => {
    forceRender();
    if (value) {
      id.value = 1;
      taskTabId.value = 1;
      overviewStatus.value = value;
    }
  },
);
watch(
  () => route.query.tasksStatus,
  () => {
    if (id.value === 0) forceRender();
  },
);
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
