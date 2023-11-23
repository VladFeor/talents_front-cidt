<template>
  <div class="filters">
    <FilterToggle
      :buttons="[
        {
          title: `In Progress ${
            dashboard && dashboard.user_tasks.in_progress ? dashboard.user_tasks.in_progress : 0
          }`,
          id: 0,
          name: 'In Progress',
        },
        {
          title: `Waiting ${
            dashboard && dashboard.user_tasks.waiting_for_review
              ? dashboard.user_tasks.waiting_for_review
              : 0
          }`,
          id: 1,
          name: 'Waiting',
        },
        {
          title: `Returned ${
            dashboard && dashboard.user_tasks.returned ? dashboard.user_tasks.returned : 0
          }`,
          id: 2,
          name: 'Returned',
        },
        {
          title: `Completed ${
            dashboard && dashboard.user_tasks.done ? dashboard.user_tasks.done : 0
          }`,
          id: 3,
          name: 'Completed',
        },
        {
          title: `Overdue ${
            dashboard && dashboard.user_tasks.overdue ? dashboard.user_tasks.overdue : 0
          }`,
          id: 4,
          name: 'Overdue',
        },
      ]"
      :id="id"
      @select="setIsShowEvents($event)"
      review
    />
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
    <div v-if="reviewsLoading || !isReviewsLoaded" class="cards-wrapper mb-10">
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
          userTask
          :key="task.name + task.priority"
          :isEarned="id === 3"
          :isOverdue="id === 4"
          :isInProgress="id === 0"
          :isWaiting="id === 1"
          :isReturned="id === 2"
        />
      </div>

      <EmptyList v-else title="There are no tasks" icon="icons8-futurama-bender" />
    </div>
  </div>
  <div v-else class="table-wrapper">
    <TableSkeleton v-if="reviewsLoading || !isReviewsLoaded" />
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
    v-if="!reviewsLoading && isReviewsLoaded && tasksRows && tasksRows.length"
    :totalPages="totalPages"
  />
</template>

<script setup>
import Badge from '@/components/Badge.vue';
import Priority from '@/components/Priority/Priority.vue';
import Talent from '@/components/Talent.vue';
import Tokens from '@/components/Tokens.vue';
import Amount from '@/components/Amount.vue';
import Rewards from '@/components/Rewards.vue';
import Earned from '@/components/Earned.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useProjectsStore } from '~/store/projects';

import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  formatNumber,
  formatNumberMore10K,
  formatNumberAddComma,
  addDaysToDate,
  timestampToString,
} from '@/util/helpers';
import { useTasksStore } from '~/store/tasks';

import { ref, computed, onMounted, inject } from 'vue';
import { useDashboardStore } from '~/store/dashboard';
import { useRouter, useRoute } from 'vue-router';

const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();
const route = useRoute();

onMounted(() => {
  projectsStore.getProjectsAction();
  isMounted = true;

  if (overviewStatus && overviewStatus.value) {
    id.value = getIdByOverviewStatus(overviewStatus.value);
    status.value = overviewStatus.value;
  } else {
    router.push({ query: { status: status.value } });
  }
  if (route.query && route.query.page) {
    currentPage.value = route.query.page;
  }
  tasksStore.getReviewsAction({ status: status.value });
});

const getIdByOverviewStatus = (status) => {
  let id;
  switch (status) {
    case 'waiting_for_review':
      id = 1;
      break;
    case 'returned':
      id = 2;
      break;
    case 'done':
      id = 3;
      break;
    case 'overdue':
      id = 4;
      break;
    default:
      id = 0;
  }
  return id;
};

let isMounted = false;

const dashboard = computed(() => dashboardStore.getDashboard);
const overviewStatus = inject('overviewStatus');
const router = useRouter();

const reviewStatus = (status) => {
  switch (status) {
    case 'In Progress':
      return 'in_progress';
    case 'Waiting':
      return 'waiting_for_review';
    case 'Returned':
      return 'returned';
    case 'Completed':
      return 'done';
    case 'Overdue':
      return 'overdue';
    default:
      return 'in_progress';
  }
};

const taskId = ref(0);
const id = ref(0);
const status = ref('in_progress');
const currentPage = ref(route.query ? route.query.page : 1);
const project = ref(null);
const sortDirection = ref('');
const sortColumn = ref('');

function nextPage(page) {
  currentPage.value = page;
  const params = {
    status: status.value,
    page,
  };

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

    if (sortColumn.value === 'manager') {
      sortName = 'manager';
    }
    if (sortColumn.value === 'talent') {
      sortName = 'talent';
    }

    if (sortColumn.value === 'deadline') {
      sortName = 'deadline_in';
    }
    if (sortColumn.value === 'deadline_in') {
      sortName = 'deadline_in';
    }
    if (sortColumn.value === 'deadline2') {
      sortName = 'deadline_in';
    }
    if (sortColumn.value === 'completed') {
      sortName = 'completed';
    }

    params.sortKey = sortName;
    params.sortType = sortDirection.value;
  }
  tasksStore.getReviewsAction(params);
}

const isProjectsFilterActive = ref(false);

const setIsProjectsFilterActive = (value) => {
  isProjectsFilterActive.value = value;
};

const filtersHandler = (data) => {
  if (!isMounted || isProjectsFilterActive.value) return;

  project.value = data.id;

  const params = {
    status: status.value,
    page: currentPage.value,
  };

  if (data.id) {
    params.project_id = data.id;
  }

  tasksStore.getReviewsAction(params);
};

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

    tasksStore.getTasksAction(params);

    emit('pagData', params);
  }
}

function setIsShowEvents(event) {
  id.value = event.id;
  status.value = reviewStatus(event.status);
  router.push({ query: { status: status.value } });
  currentPage.value = 1;

  const params = {
    status: reviewStatus(event.status),
    page: 1,
  };

  if (project.value) {
    params.project_id = project.value;
  }
  tasksStore.getReviewsAction(params);
}

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

  const projectsIds = projectsArray.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

  const projectsOptions = [
    {
      name: 'All Projects',
      id: '',
    },
  ].concat(projectsIds);
  return projectsOptions;
});

const tasksStore = useTasksStore();
const reviews = computed(() => tasksStore.getReviews);
const reviewsLoading = computed(() => tasksStore.getReviewsLoading);
const isReviewsLoaded = computed(() => tasksStore.getReviewsLoaded);

const tasksColumns = computed(() => {
  if (id.value === 3) {
    return [
      { prop: 'task', label: 'Task', width: '130%' },
      { prop: 'rewards', label: 'Rewards', width: '80%' },
      { prop: 'earned_points', label: 'Earned Points', width: '70%' },
      { prop: 'project', label: 'Project', width: '60%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'completed',
        label: 'Completed',
        width: '50%',
      },
    ];
  } else if (id.value === 4) {
    return [
      { prop: 'task', label: 'Task', width: '130%' },
      { prop: 'rewards', label: 'Rewards', width: '80%' },
      { prop: 'project', label: 'Project', width: '60%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline2',
        label: 'Deadline',
        width: '40%',
      },
      { prop: 'badge', label: '', width: '10%' },
    ];
  } else if (id.value === 0) {
    return [
      { prop: 'task', label: 'Task', width: '130%' },
      { prop: 'rewards', label: 'Rewards', width: '80%' },
      { prop: 'project', label: 'Project', width: '60%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline2',
        label: 'Deadline in',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '30%' },
    ];
  } else if (id.value === 1) {
    return [
      { prop: 'task', label: 'Task', width: '130%' },
      { prop: 'rewards', label: 'Rewards', width: '80%' },
      { prop: 'project', label: 'Project', width: '60%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadline2',
        label: 'Deadline',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '30%' },
    ];
  } else {
    return [
      { prop: 'task', label: 'Task', width: '130%' },
      { prop: 'rewards', label: 'Rewards', width: '80%' },
      { prop: 'project', label: 'Project', width: '60%' },
      { prop: 'direction', label: 'Direction', width: '50%' },
      {
        prop: 'deadlineReturned',
        label: 'Deadline',
        width: '50%',
      },
      { prop: 'priority', label: 'Priority', width: '30%' },
    ];
  }
});
const totalPages = computed(() => tasksStore.getReviews.pagination.total_pages);

const allTasksData = computed(() => tasksStore.getReviews);
const allTasks = computed(() => tasksStore.getReviews.data);

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
    console.log('WATCH task Mine', value);
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
    page: currentPage.value,
  };

  if (project.value) {
    params.project_id = project.value;
  }
  if (type) {
    params.sortKey = name;
    params.sortType = type;
  }

  tasksStore.getReviewsAction(params);
};

const sortTasks = (prop, direction) => {
  if (!isMounted) return;

  if (prop === 'task') {
    sortHandle('name', direction);
  }
  if (prop === 'project') {
    sortHandle('project', direction);
  }
  if (prop === 'manager') {
    sortHandle('manager', direction);
  }
  if (prop === 'talent') {
    sortHandle('talent', direction);
  }
  if (prop === 'direction') {
    sortHandle('direction', direction);
  }
  if (prop === 'deadline') {
    sortHandle('deadline_in', direction);
  }
  if (prop === 'deadline_in') {
    sortHandle('deadline_in', direction);
  }
  if (prop === 'deadline2') {
    sortHandle('deadline_in', direction);
  }
  if (prop === 'priority') {
    sortHandle('priority', direction);
  }
  if (prop === 'completed') {
    sortHandle('completed', direction);
  }
  if (prop === 'rewards') {
    sortHandle('rewards', direction);
  }
};

const getRewardsIcons = (reward) => {
  if (!reward.rewards) return [];
  const icons = [];

  if (reward.rewards.some((item) => item.type === 'coins')) {
    icons.push(reward.coin_type.symbol);
  }

  if (reward.rewards.some((item) => item.type === 'discord_role')) {
    icons.push('discord');
  }

  return icons;
};

const tasksRows = computed(
  () => {
    const tasksArray = allTasks.value;
    if (!tasksArray || (tasksArray && !tasksArray.length)) {
      return [];
    }    console.log("TASKS_ARR",tasksArray)
    return tasksArray.map((item) => {
      return {
        to: `tasks/my-task/${item.id}`,
        task: {
          content: item.task.name,
        },
        multiRewards: {
          component: Rewards,
          props: {
            amount:
              item.task.rewards && item.task.rewards.length ? item.task.rewards[0].value : '0',
            currency: item.task.coin_type.symbol.toLowerCase(),
            isMoreBtn: item.task.rewards.length > 1 ? true : false,
            rewards: item.task.rewards,
            projectId: item.task.project && item.task.project.id ? item.task.project.id : 0,
            task: item.task,
          },
        },
        rewards: {
          // component: Tokens,
          // props: {
          //   currencies: getRewardsIcons(item.task),
          // },
          component: Amount,
          props: {
            amount:
              item.task.rewards && item.task.rewards.length ? item.task.rewards[0].value : '0',
            currency: item.task.coin_type.symbol.toLowerCase(),
            isMoreBtn: item.task.rewards.length > 1 ? true : false,
            rewards: item.task.rewards,
            projectId: item.task.project && item.task.project.id ? item.task.project.id : 0,
          },
        },
        project: {
          component: Talent,
          props: {
            text: item.task.project ? item.task.project.name : '',
            img: item.task.project && item.task.project.logo ? item.task.project.logo : defaultBg,
            square: true,
            reduceLength: 15,
            conditions: item.project?.conditions,
            any: item.project?.any // any || all conditions
          },
        },
        earned_points: {
          component: Earned,
          props: {
            rating: item.rating,
          },
        },
        direction: {
          component: Badge,
          props: {
            text: item.task.activity ? item.task.activity.name : 'All',
            value: '',
            type: getBadgeTypeByName(item.task.activity ? item.task.activity.name : 'All'),
            big: false,
          },
        },
        start: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.task.started_at)),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        deadlineReturned: {
          component: Badge,
          props: {
            text: formatDate(addDaysToDate(timestampToString(item.returned_at), 2)),
            // text: formatFutureDate(addDaysToDate(item.returned_at, 2)),
            value: '',
            type: 'transparent',
            big: false,
            futureDate: timestampToString(item.returned_at),
          },
          time: formatFutureDate(addDaysToDate(timestampToString(item.returned_at), 2)),
          adjustReturnBtn: item.returned ? item.returned : false,
        },
        deadline: {
          component: Badge,
          props: {
            text: formatFutureDate(timestampToString(item.reported_at)),
            value: '',
            type: 'transparent',
            big: false,
            futureDate: timestampToString(item.reported_at),
          },
          time: formatNumber(timestampToString(item.reported_at)),
          adjustReturnBtn: item.returned ? item.returned : false,
        },
        deadline2: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.task.ended_at)),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        completed: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.completed_at)),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        end: {
          component: Badge,
          props: {
            text: formatDate(timestampToString(item.ended_at)),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        priority: {
          component: Priority,
          props: {
            dots: item.task.priority,
          },
        },
        badge: {
          component: Badge,
          props: {
            text: item.status === 'overdue_by_manager' ? 'm' : 't',
            value: '',
            type: 'task',
            big: false,
          },
        },
      };
    });
  },
  { dependsOn: [allTasks] },
);
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
