<template>
  <div class="filters">
    <div class="toggles_wrapper">
      <FilterToggle
        :buttons="[
          {
            title: `Available ${
              dashboard && dashboard.tasks.available ? dashboard.tasks.available : 0
            }`,
            id: 0,
            name: 'Available',
          },
          {
            title: `Upcoming ${
              dashboard && dashboard.tasks.upcoming ? dashboard.tasks.upcoming : 0
            }`,
            id: 1,
            name: 'Upcoming',
          },
        ]"
        :id="id"
        @select="setIsShowEvents($event)"
      />
      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        :options="rewards"
        @input="filtersHandler($event, 'reward')"
      />
      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        filter
        :options="projects"
        @input="filtersHandler($event, 'project')"
        type="project"
        :setIsFilterActive="setIsProjectsFilterActive"
        :reduceLength="14"
      />
      <TasksSelect
        :isClear="isClear"
        :setIsClear="setIsClear"
        :options="typesOptions"
        type="type"
        @input="filtersHandler($event, 'types')"
      />
      <div v-if="isFilterBtnActive" class="clear-filtrers" @click="clearFilters">
        <span>Clear All</span>
      </div>
    </div>
    <TasksToggle
      :buttons="[
        { title: 'Grid', id: 0 },
        { title: 'List', id: 1 },
      ]"
      :id="0"
      @select="setIsShowTasks($event)"
    ></TasksToggle>
  </div>
  <div v-if="taskId == 0" class="cards-wrapper">
    <div v-if="tasksLoading || !isTasksLoaded" class="cards-wrapper mb-10">
      <TaskCardSkeleton v-for="i in 9" :key="i" />
    </div>
    <div v-else w-full>
      <div
        v-if="tasksRows && tasksRows.length"
        class="cards-wrapper"
        :class="{ noPagination: totalPages < 2 }"
      >
        <TaskCard
          v-for="task in tasksRows"
          :task="task"
          :key="task.name + task.priority"
          :isPersonalTask="task.isPersonalTask"
          @connect-wallet="(value) => isShowConnectModal = value"
        />
      </div>
      <EmptyList v-else title="There are no tasks" icon="icons8-futurama-bender" />
    </div>
  </div>
  <div v-else class="table-wrapper">
    <TableSkeleton v-if="tasksLoading || !isTasksLoaded" />
    <BaseTable
      v-else
      :columns="tasksColumns"
      :rows="tasksRows"
      pointer
      title="You have no tasks yet"
      icon="icons8-futurama-bender"
      :sortFunction="sortTasks"
      :sortDirection="sortDirection"
      :setSortDirection="setSortDirection"
      :sortColumn="sortColumn"
      :setSortColumn="setSortColumn"
      isSorting
    />
  </div>

  <Pagination
    @pageChanged="nextPage($event)"
    :currentPage="currentPage"
    v-if="!tasksLoading && isTasksLoaded && tasksRows && tasksRows.length"
    :totalPages="totalPages"
  />
  <BaseModal :width="480" @close="isShowConnectModal = false" :visible="isShowConnectModal" :isScrollOff="true">
    <ConnectWalletModal @close="toggleWalletConnecting" @error="handleWalletConnectionError" />
  </BaseModal>
</template>

<script setup>
import Badge from '@/components/Badge.vue';
import Tokens from '@/components/Tokens.vue';
import Priority from '@/components/Priority/Priority.vue';
import Talent from '@/components/Talent.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import Amount from '@/components/Amount.vue';
import Rewards from '@/components/Rewards.vue';

import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
  timestampToString,
} from '@/util/helpers';
import { useTasksStore } from '~/store/tasks';
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import { ref, computed, onMounted, defineEmits } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['pagData']);

const props = defineProps({
  search: { type: String, default: '' },
});

const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();

onMounted(() => {
  if (route.query && route.query.tasksStatus) {
    id.value = getIdByTasksStatus(route.query.tasksStatus);
    status.value = route.query.tasksStatus;
  }
  if (route.query && route.query.page) {
    currentPage.value = route.query.page;
  }
  projectsStore.getProjectsAction();
  tasksStore.getTasksAction({
    page: currentPage.value,
    status: status.value,
    search: props.search,
  });
  emit('pagData', { status: status.value, page: currentPage.value, search: props.search });
  isMounted = true;
});

const getIdByTasksStatus = (status) => {
  let id;
  switch (status) {
    case 'upcoming':
      id = 1;
      break;
    default:
      id = 0;
  }
  return id;
};

const rewards = [
  {
    name: 'All Rewards',
    id: '',
  },
  {
    name: 'Coins',
    id: 'coins',
  },
  {
    name: 'Discord Role',
    id: 'discord_role',
  },
  {
    name: 'Credits',
    id: 'credits',
  },
  // {
  //   name: 'NFT',
  //   id: 'nft',
  // },
];

const typesOptions = [
  {
    name: 'Any Types',
    id: '',
  },
  {
    name: 'On-Chain',
    id: 'on',
  },
  {
    name: 'Off-Chain',
    id: 'of',
  },
];

const priorities = [
  {
    name: 'All Priorities',
    id: '',
  },
  {
    name: 'Low',
    id: 'low',
  },
  {
    name: 'Middle',
    id: 'medium',
  },
  {
    name: 'High',
    id: 'high',
  },
];

const projects = computed(() => {
  const projectsArray = projectsStore.getProjects;
  if (!projectsArray || (projectsArray && !projectsArray.length)) {
    return [
      {
        name: 'All Projects',
        id: '',
      },
    ];
  }

  const projectsIds = projectsArray.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  const projectsOptions = [
    {
      name: 'All Projects',
      id: '',
    },
  ].concat(projectsIds);
  return projectsOptions;
});

const reward = ref('');
const types = ref('');
const priority = ref('');
const project = ref(null);
const sortDirection = ref('');
const sortColumn = ref('');
const isShowConnectModal = ref(false);
const isShowConnectionModal = ref(false);
const isConnectingError = ref(false);
let isMounted = false;

const isFilterBtnActive = computed(() => {
  if (reward.value || priority.value || project.value) return true;
  else return false;
});

const currentPage = ref(route.query ? route.query.page : 1);

const id = ref(0);
const taskId = ref(0);
const status = ref('available');

const isProjectsFilterActive = ref(false);

const setIsProjectsFilterActive = (value) => {
  isProjectsFilterActive.value = value;
};

const isClear = ref(false);

const setIsClear = (value) => {
  isClear.value = value;
};

const filtersHandler = (data, type) => {
  if (!isMounted || isProjectsFilterActive.value) return;
  if (type === 'reward') {
    reward.value = data.id;
  }
  if (type === 'priority') {
    priority.value = data.id;
  }
  if (type === 'project') {
    project.value = data.id;
  }
  if (type === 'types') {
    types.value = data.id;
  }

  const params = {
    status: status.value,
    search: props.search,
    // page: currentPage.value,
    page: 1,
  };

  if ((type === 'reward' && data.id) || reward.value) {
    params.reward_type = type === 'reward' ? data.id : reward.value;
  }
  if ((type === 'priority' && data.id) || priority.value) {
    params.priority = type === 'priority' ? data.id : priority.value;
  }
  if ((type === 'project' && data.id) || project.value) {
    params.project_id = type === 'project' ? data.id : project.value;
  }
  if ((type === 'types' && data.id) || types.value) {
    params.types = type === 'types' ? data.id : types.value;
  }

  tasksStore.getTasksAction(params);
  emit('pagData', params);
};

const searchInterval = ref(null);

const clearFilters = () => {
  clearTimeout(searchInterval.value);

  searchInterval.value = setTimeout(() => {
    setIsClear(true);
  }, 500);
};

function nextPage(page) {
  currentPage.value = page;
  const params = {
    status: status.value,
    page,
    search: props.search,
  };
  if (reward.value) {
    params.reward_type = reward.value;
  }
  if (priority.value) {
    params.priority = priority.value;
  }
  if (project.value) {
    params.project_id = project.value;
  }
  if (sortDirection.value) {
    let sortName = '';
    if (sortColumn.value === 'task') {
      sortName = 'name';
    }
    if (sortColumn.value === 'project') {
      sortName = 'project';
    }
    if (sortColumn.value === 'direction') {
      sortName = 'direction';
    }
    if (sortColumn.value === 'start') {
      sortName = 'started_at';
    }
    if (sortColumn.value === 'deadline') {
      sortName = 'ended_at';
    }
    if (sortColumn.value === 'priority') {
      sortName = 'priority';
    }
    if (sortColumn.value === 'rewards') {
      sortName = 'rewards';
    }
    params.sortKey = sortName;
    params.sortType = sortDirection.value;
  }
  if (types.value) {
    params.types = types.value;
  }
  tasksStore.getTasksAction(params);
  emit('pagData', params);
}

function setIsShowTasks(event) {
  taskId.value = event;
  if ((event === 0 && sortDirection.value) || (event === 0 && sortColumn.value)) {
    sortDirection.value = '';
    sortColumn.value = '';
    const params = {
      status: status.value,
      search: props.search,
      page: currentPage.value,
    };
    if (reward.value) {
      params.reward_type = reward.value;
    }
    if (priority.value) {
      params.priority = priority.value;
    }
    if (project.value) {
      params.project_id = project.value;
    }
    if (types.value) {
      params.types = types.value;
    }
    tasksStore.getTasksAction(params);

    emit('pagData', params);
  }
}
function setIsShowEvents(event) {
  id.value = event.id;
  status.value = event.status.toLowerCase();
  router.push({ query: { tasksStatus: status.value } });
  currentPage.value = 1;
  const params = {
    status: status.value,
    search: props.search,
    page: 1,
  };
  if (reward.value) {
    params.reward_type = reward.value;
  }
  if (priority.value) {
    params.priority = priority.value;
  }
  if (project.value) {
    params.project_id = project.value;
  }
  if (types.value) {
    params.types = types.value;
  }
  tasksStore.getTasksAction(params);

  emit('pagData', params);
}

const tasksStore = useTasksStore();
const tasks = computed(() => tasksStore.getTasks);
const tasksLoading = computed(() => tasksStore.getTasksLoading);
const isTasksLoaded = computed(() => tasksStore.getTasksLoaded);
const dashboard = computed(() => {
  return dashboardStore.getDashboard;
});

const tasksColumns = computed(() => {
  return [
    { prop: 'task', label: 'Task', width: '140%' },
    { prop: 'rewards', label: 'Rewards', width: '90%' },
    { prop: 'project', label: 'Project', width: '80%' },
    { prop: 'direction', label: 'Direction', width: '60%' },
    {
      prop: 'start',
      label: 'Start',
      width: '60%',
    },
    {
      prop: 'deadline',
      label: 'Deadline',
      width: '60%',
    },
    { prop: 'priority', label: 'Priority', width: '30%' },
  ];
});

const getRewardsIcons = (reward) => {
  const icons = [];

  if (reward.rewards.some((item) => item.type === 'coins')) {
    icons.push(reward.coin_type.name);
  }

  if (reward.rewards.some((item) => item.type === 'discord_role')) {
    icons.push('discord');
  }

  return icons;
};

const totalPages = computed(() => tasksStore.getTasks?.pagination?.total_pages);
const totalTasks = computed(() => tasksStore.getTasks?.pagination?.total);

const allTasksData = computed(() => tasksStore.getTasks);
const allTasks = computed(() => tasksStore.getTasks.data);

let baseTasks = null;

const getProperty = (obj, prop) => {
  const props = prop.split('.');
  const regex = /\[(\d+)\]/;

  return props.reduce((prev, curr) => {
    const matches = regex.exec(curr);
    if (matches) {
      const index = parseInt(matches[1]);
      const arrProp = curr.slice(0, matches.index);
      return prev[arrProp][index];
    } else {
      return prev && prev[curr];
    }
  }, obj);
};

watch(allTasksData, (value) => {
  if (value) {
    baseTasks = JSON.parse(JSON.stringify(value));
  }
});

const setSortDirection = (value) => {
  sortDirection.value = value;
};
const setSortColumn = (value) => {
  sortColumn.value = value;
};

const sortHandle = (name, type) => {
  const params = {
    status: status.value,
    search: props.search,
    page: currentPage.value,
  };
  if (reward.value) {
    params.reward_type = reward.value;
  }
  if (priority.value) {
    params.priority = priority.value;
  }
  if (project.value) {
    params.project_id = project.value;
  }
  if (types.value) {
    params.types = types.value;
  }
  if (type) {
    console.log('sortHandle name', name);
    console.log('sortHandle type', type);
    params.sortKey = name;
    params.sortType = type;
  }
  tasksStore.getTasksAction(params);
  emit('pagData', params);
};

const sortTasks = (prop, direction) => {
  if (!isMounted) return;
  if (prop === 'task') {
    sortHandle('name', direction);
  }
  if (prop === 'project') {
    sortHandle('project', direction);
  }
  if (prop === 'direction') {
    sortHandle('direction', direction);
  }
  if (prop === 'start') {
    sortHandle('started_at', direction);
  }
  if (prop === 'deadline') {
    sortHandle('ended_at', direction);
  }
  if (prop === 'priority') {
    sortHandle('priority', direction);
  }
  if (prop === 'rewards') {
    sortHandle('rewards', direction);
  }
  if (prop === 'types') {
    sortHandle('types', direction);
  }
};

const tasksRows = computed(
  () => {
    const tasksArray = allTasks.value;
    if (!tasksArray || (tasksArray && !tasksArray.length)) {
      return [];
    }
    console.log("TASKS_ARR",tasksArray)
    return tasksArray.map((item) => {
      return {
        id: item.id,
        to: `tasks/task/${item.id}`,
        isPersonalTask: item.assigned_to_user,
        personalColor: item.activity
          ? item.activity.name.toLowerCase().split(' ').join('_')
          : 'all',
        task: {
          content: item.name,
        },
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
            currency: item.coin_type.symbol.toLowerCase() || item.coin_type.name.toLowerCase(),
            isMoreBtn: item.rewards.length > 1 ? true : false,
            rewards: item.rewards,
            projectId: item.project && item.project.id ? item.project.id : 0,
          },
          // component: Tokens,
          // props: {
          //   currencies: getRewardsIcons(item),
          // },
        },
        project: {
          component: Talent,
          props: {
            id: item.project.id,
            text: item.project ? item.project.name : '',
            img: item.project && item.project.logo ? item.project.logo : defaultBg,
            square: true,
            reduceLength: 15,
            conditions: item.project.conditions,
            any: item.project?.any // any || all conditions
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
        workingUsers: item.working_users
      };
    });
  },
  { dependsOn: [allTasks] },
);

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
</script>

<style lang="scss" scoped>
.cards-wrapper {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  .noPagination {
    padding-bottom: 50px;
  }
}
.clear-filtrers {
  width: 71px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: #eaeafb;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    font-feature-settings: 'zero' on;
    color: #6a6d8f;
  }
}
.toggles_wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filters {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 8px;
}
.custom-project-select {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 25px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
}
.filter-select {
  width: 160px;
  height: 32px;
}
</style>
