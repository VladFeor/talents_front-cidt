<template>
  <div class="w-auto">
    <section class="section title">
      <div class="main-title">Hello, {{ user ? user.name : '' }}!!!</div>
    </section>
    <section v-if="dashboardOverviewLoading" class="section">
      <div class="overview">
        <StatCardSkeleton size="small" v-for="i in 8" :key="i" />
      </div>
      <RefferalCardSkeleton />
    </section>
    <section v-else class="section">
      <div class="overview">
        <stat-card-small
          v-for="i in bigInfo"
          :key="i.value"
          :title="i.title"
          :value="i.value"
          @click="navigateToElement(i)"
          class="pointer"
        ></stat-card-small>
        <div class="level-card_wrapper">
          <LevelCard v-if="userLevel" :data="userLevel" class="ml-auto mr-auto"></LevelCard>
        </div>
        <stat-card-small
          v-for="i in smallInfo"
          :is-active="i.active"
          :key="i.value"
          :title="i.title"
          :value="i.value"
          class="w-1/2 pointer"
          @click="navigateToElement(i)"
        ></stat-card-small>
      </div>
      <RefferalCard class="w-1/3"></RefferalCard>
    </section>
    <section class="gap section">
      <div class="overview-chart">
        <div class="section-custom-title">
          <CustomTitle :loading="statisticChartLoading" text="Statistics" />
        </div>
        <StatisticsChart />
      </div>
      <div class="short-section">
        <div class="section-custom-title event">
          <CustomTitle :loading="eventsLoading" text="Events" />
        </div>
        <CalendarSkeleton v-if="eventsLoading" />
        <EventsCalendar v-else />
      </div>
    </section>
    <section class="section gap">
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="availableTasksLoading" text="Newest Available Tasks" />
          <CustomLink
            :loading="availableTasksLoading"
            :text="`All ${countAvailableTasks ? countAvailableTasks : 0} Tasks`"
            to="/tasks"
          />
        </div>

        <TableSkeleton v-if="availableTasksLoading" />
        <BaseTable
          v-else
          title="No data"
          icon="icons8-futurama-amy-bender"
          :columns="availableTasksColumns"
          :rows="availableTasksRows"
          pointer
        />
      </div>
    </section>
    <!--    <section class="section">-->
    <!--      <JoinToCard class="w-full"></JoinToCard>-->
    <!--    </section>-->
    <section class="section gap">
      <div class="section-inner">
        <div class="section-custom-title">
          <CustomTitle :loading="leaderBoardLoading" text="Leaderboard" />
          <CustomLink :loading="leaderBoardLoading" text="Leaderboard" to="/leaderboard" />
        </div>
        <div v-if="leaderBoardLoading" class="flex justify-between">
          <TalentCardSkeleton v-for="i in 3" :key="i" />
        </div>
        <div v-else class="flex justify-between">
          <LeaderboardItemCard
            v-for="i in leaderBoard"
            :key="i.id"
            :ambassador="i"
          ></LeaderboardItemCard>
        </div>
      </div>
      <div class="short-section">
        <div class="section-custom-title event">
          <CustomTitle text="Collaborations" light />
        </div>
        <CollaborationsCard></CollaborationsCard>
      </div>
    </section>
  </div>
</template>

<script setup>
import Amount from '@/components/Amount.vue';
import { onMounted, computed, ref } from 'vue';
import Badge from '@/components/Badge.vue';
import Talent from '@/components/Talent.vue';
import Priority from '@/components/Priority/Priority.vue';
import { useUserStore } from '~/store/user';
import { useDashboardStore } from '~/store/dashboard';
import { useEventsStore } from '~/store/events';
import {
  formatFutureDate,
  formatPastDate,
  formatDate,
  getBadgeTypeByName,
  getLinkPathByName,
  timestampToString,
} from '@/util/helpers';

const dashboardStore = useDashboardStore();
const userStore = useUserStore();
const eventsStore = useEventsStore();
const router = useRouter();

onMounted(() => {
  dashboardStore.getDashboardAction();
  dashboardStore.getDashboardOverviewAction();
  dashboardStore.getLeaderBoardAction();
  dashboardStore.getAvailableTasksAction();
  eventsStore.getEventsAction();
});

const user = computed(() => userStore.getUser);
const eventsLoading = computed(() => eventsStore.getEventsLoading);
const userStat = computed(() => dashboardStore.getDashboardOverview);
const dashboardOverviewLoading = computed(() => dashboardStore.getDashboardOverviewLoading);
const availableTasks = computed(() => dashboardStore.getAvailableTasks);
const availableTasksLoading = computed(() => dashboardStore.getAvailableTasksLoading);

const countAvailableTasks = computed(() => dashboardStore.getAvailableTasks.count);
const availableTasksColumns = computed(() => {
  return [
    { prop: 'task', label: 'Task', width: '150%' },
    {
      prop: 'rewards',
      label: 'Rewards',
      width: '100%',
    },
    {
      prop: 'project',
      label: 'Project',
      width: '100%',
    },
    {
      prop: 'direction',
      label: 'Direction',
      width: '70%',
    },
    {
      prop: 'start',
      label: 'Start',
      width: '50%',
    },
    {
      prop: 'deadline',
      label: 'Deadline',
      width: '40%',
    },
    { prop: 'priority', label: 'Priority', justify: 'right', width: '10%' },
  ];
});

const availableTasksRows = computed(() => {
  const originalArray = dashboardStore.getAvailableTasks.data;

  if (!originalArray || (originalArray && !originalArray.length)) {
    return [];
  }
  return originalArray.map((item) => {
    return {
      to: `tasks/task/${item.id}`,
      options: {
        border: item.assigned_to_user,
      },
      task: { content: item.name, reduceLength: 27, border: item.assigned_to_user },
      rewards: {
        component: Amount,
        props: {
          amount: item.rewards && item.rewards.length ? item.rewards[0].value : '0',
          currency:
            item.coin_type && item.coin_type.symbol ? item.coin_type.symbol.toLowerCase() : null,
          isMoreBtn: item.rewards && item.rewards.length > 1,
          rewards: item.rewards,
          projectId: item.project.id,
        },
      },
      project: {
        component: Talent,
        props: {
          text: item.project ? item.project.name : '',
          img: item.project ? item.project.logo : defaultBg,
          square: true,
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
          text: formatFutureDate(timestampToString(item.ended_at)),
          value: '',
          type: 'transparent',
          big: false,
          futureDate: item.ended_at,
        },
      },
      priority: {
        component: Priority,
        props: {
          dots: item.priority,
        },
      },
    };
  });
});

const userLevel = computed(() => {
  if (Object.keys(userStat.value).length) {
    return {
      level: userStat.value.level_data.level,
      totalPoints: userStat.value.level_data.points,
      nextLevel: userStat.value.level_data.next_level,
      total: userStat.value.level_data.need_points,
      progress: userStat.value.level_data.points,
    };
  } else return null;
});

const smallInfo = computed(() => {
  if (Object.keys(userStat.value).length) {
    return [
      {
        title: 'deadlines in 3 days',
        value: userStat.value.tasks.overdue,
        active: true,
        link: getLinkPathByName('deadlines'),
      },
      {
        title: 'in progress',
        value: userStat.value.tasks.in_progress,
        link: getLinkPathByName('in progress'),
      },
      {
        title: 'on revision',
        value: userStat.value.tasks.on_revision,
        link: getLinkPathByName('on revision'),
      },
      {
        title: 'completed',
        value: userStat.value.tasks.completed,
        link: getLinkPathByName('completed'),
      },
    ];
  } else return null;
});
const bigInfo = computed(() => {
  if (Object.keys(userStat.value).length) {
    return [
      {
        title: 'USDT earned',
        value: userStat.value.earned_usdt,
        link: getLinkPathByName('earned'),
      },
      {
        title: 'joined projects',
        value: userStat.value.joined_projects,
        link: getLinkPathByName('joined projects'),
      },
    ];
  } else return null;
});

let type = 'completed_tasks';
const leaderBoard = computed(() => dashboardStore.getLeaderBoard);
const leaderBoardLoading = computed(() => dashboardStore.getLeaderBoardLoading);
const statisticChartLoading = computed(() => dashboardStore.getStatisticChartLoading);

const navigateToElement = (statCard) => {
  if (statCard.title.toLowerCase() === 'joined projects') {
    router.push({
      path: '/projects',
      query: { status: 'joined' },
    });
  } else if (statCard.title.toLowerCase() === 'in progress') {
    router.push({
      path: '/tasks',
      query: { status: 'in_progress' },
    });
  } else if (statCard.title.toLowerCase() === 'on revision') {
    router.push({
      path: '/tasks',
      query: { status: 'on_revision' },
    });
  } else if (statCard.title.toLowerCase() === 'completed') {
    router.push({
      path: '/tasks',
      query: { status: 'done' },
    });
  } else {
    router.push(statCard.link);
  }
};
</script>

<style scoped lang="scss">
.main-title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 300;
  font-size: 56px;
  line-height: 72px;
  color: $section-title;
  margin-bottom: 40px;
}
.section-inner {
  width: 100%;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  margin-bottom: 48px;
  &.title {
    margin-bottom: 8px;
  }
  &.gap {
    gap: 40px;
  }
  &.one {
    flex-direction: column;
  }
  &.non-active {
    display: none;
  }
  @media (max-width: 1300px) {
    flex-direction: column;
    gap: 30px;
  }
}
.section-custom-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
}
.btns_wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
.level-card_wrapper {
  width: 372px;
}
.overview-chart {
  width: 100%;
  max-width: 800px;
}
.overview {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.overview_items {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 10px;
  &.talent {
    padding-top: 0;
  }
  &.owner {
    padding-top: 0;
    justify-content: space-between;
  }
}
.short-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
  &.cards {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 55px;
  }
  &.event {
    gap: 10px;
  }
}
.talents-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
