<template>
  <div class="filters">
    <div class="toggles_wrapper">
      <FilterToggle
        :buttons="[
          {
            title: `Talentum`,
            id: 0,
            name: 'Talentum',
          },
          {
            title: `Joined Projects`,
            id: 1,
            name: 'Joined Projects',
          },
        ]"
        :id="id"
        @select="setTable($event)"
      />
      <div class="line"></div>
      <FilterToggle
        :buttons="labels"
        :id="filterId"
        @select="addTags({ ...$event, type: 'activity_id' })"
      />
      <TasksSelect
        filter
        v-if="status && projects.length"
        :options="projects"
        @input="addTags({ ...$event, type: 'project_id' })"
        type="project"
        :reduceLength="12"
      />
      <MultiSelectLevel
        v-if="!status"
        @selectLvl="addLevel"
        :reset="resetLvl"
        @reset="removeLevel"
        type="lvl"
      ></MultiSelectLevel>
    </div>
  </div>

  <TableSkeleton v-if="!loaded" />
  <div v-else>
    <LeaderBoardTalentsTable
      v-if="!status"
      :columns="tasksColumns"
      :rows="leaderBoardRows"
      :myRank="myRank"
      pointer
      title="No Data"
      icon="icons8-futurama-bender"
    />
    <BaseTable
      v-else
      :columns="tasksColumns"
      :rows="leaderBoardProjectsRows"
      pointer
      title="No Data"
      icon="icons8-futurama-bender"
    />
  </div>
  <Pagination
    :currentPage="talents.pagination.current_page"
    @pageChanged="nextPage($event)"
    v-if="loaded && leaderBoardRows && leaderBoardRows.length"
    :totalPages="talents.pagination.total_pages"
  />
</template>

<script setup>
import Talent from '@/components/Talent.vue';
import Level from '@/components/Level/Level.vue';
import Rank from '~/components/Leaderboard/Rank.vue';
import defaultBg from '@/assets/images/default-avatar.png';
import { useProjectsStore } from '~/store/projects';
import { useDashboardStore } from '~/store/dashboard';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useLeaderBoardStore } from '~/store/leaderboard';
import { useUserStore } from '~/store';
const myStore = useUserStore();

const emit = defineEmits(['pagData']);
const deletedId = ref();
const tags = ref([]);
const dashboardStore = useDashboardStore();
const projectsStore = useProjectsStore();
const leaderBoardStore = useLeaderBoardStore();
watch(tags.value, (newValue) => {
  leaderBoardStore.getLeaderBoardAction(1, setParrams(newValue), status.value);
});
const labels = computed(() => {
  const projectsOptions = [
    {
      name: 'All',
      title: 'All',
      id: 0,
    },
  ];
  const labels = myStore.getUser.activities
    .filter((item) => item.status === 'approved')
    ?.map((item) => {
      return {
        id: item.activity.id,
        name: item.activity.name,
        title: item.activity.name,
      };
    });

  return labels.concat(projectsOptions).reverse();
});
const setParrams = (data) => {
  const params = {};

  if (status.value) {
    params[`project_id`] = projects.value[0]?.id;
  }

  data.forEach((item) => {
    const { id, type, value } = item;
    if (type === 'lvl') {
      params['levels'] = value;
    } else if (id) {
      params[`${type}`] = id;
    }
  });

  return params;
};
const removeLevel = () => {
  const index = tags.value.findIndex((el) => el.type === 'lvl');
  if (index !== -1) {
    tags.value.splice(index, 1);
    resetLvl.value = true;
  }
};
const addTags = (item) => {
  deletedId.value = '';
  if (item.type === 'activity_id') {
    filterId.value = item.id;
  }
  if (item) {
    if (item.type === 'xp' || item.type === 'task' || item.type === 'activity_id') {
      const index = tags.value.findIndex((el) => el.type === item.type);
      if (index !== -1) {
        tags.value.splice(index, 1);
        resetLvl.value = false;
      }
    }
    if (
      item.type === 'project_id' &&
      tags.value.filter((i) => i.type === 'project_id' && item.id !== i.id).length >= 1
    ) {
      const index = tags.value.findIndex((el) => el.type === item.type);
      if (index !== -1) {
        tags.value.splice(index, 1);
      }
    }
    const newTags = [...tags.value, item];
    const groups = newTags.reduce((acc, item) => {
      const key = JSON.stringify(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const itemsToRemove = newTags.filter((item) => groups[JSON.stringify(item)] !== 1);

    itemsToRemove.forEach((itemToRemove) => {
      const indexToRemove = tags.value.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(itemToRemove),
      );
      if (indexToRemove !== -1) {
        tags.value.splice(indexToRemove, 1);
      }
    });

    if (!itemsToRemove.includes(item)) {
      tags.value.push(item);
    }
  }
};
const router = useRouter();
const route = useRoute();
const addLevel = async (item) => {
  const index = tags.value.findIndex((el) => el.type === 'lvl');
  if (index !== -1) {
    tags.value.splice(index, 1);
  }
  tags.value.push(item);
};
const reset = ref(false);
const resetLvl = ref(false);
const clear = async () => {
  reset.value = true;
  resetLvl.value = true;
  await nextTick();
  tags.value.splice(0, tags.value.length);
  reset.value = false;
  resetLvl.value = false;
};
onMounted(async () => {
  await projectsStore.getProjectsAction(true);
  await leaderBoardStore.getLeaderBoardAction(1, '', status.value);
  if (route.query && route.query.table) {
    await setTable({ id: +route.query.table });
  }
  if (route.query && route.query.type) {
    await addTags({ id: +route.query.type, type: 'activity_id' });
  }
  isMounted = true;
});
const talents = computed(() => leaderBoardStore.getLeaderBoard);
const loaded = computed(() => leaderBoardStore.getLeaderBoardLoaded);
const projects = computed(() =>
  projectsStore.getProjects.map((item) => ({
    id: item.id,
    name: item.name,
    logo: item.logo,
  })),
);
const priority = ref('');
const direction = ref('');
const project = ref(null);
let isMounted = false;

const currentPage = ref(route.query ? route.query.page : 1);

const nextPage = (page) => {
  leaderBoardStore.getLeaderBoardAction(page, setParrams(tags.value), status.value);
};
const id = ref(0);
const filterId = ref(0);

const tasksColumns = computed(() => {
  if (!status.value) {
    return [
      { prop: 'rank', label: '#', width: '25%' },
      { prop: 'talent', label: 'Talent', width: '140%' },
      { prop: 'level', label: 'Level', width: '60%' },
      {
        prop: 'qp',
        label: 'QP',
        width: '60%',
      },
      { prop: 'completed_tasks', label: 'Completed Tasks', width: '30%' },
    ];
  } else {
    return [
      { prop: 'rank', label: '#', width: '25%' },
      { prop: 'talent', label: 'Talent', width: '280%' },
      {
        prop: 'qp',
        label: 'QP',
        width: '60%',
      },
      {
        prop: 'credits',
        label: 'Credits',
        width: '60%',
      },
      { prop: 'completed_tasks', label: 'Completed Tasks', width: '30%' },
    ];
  }
});
const status = ref(id.value !== 0);
const setTable = async (item) => {
  status.value = item.id !== 0;
  await clear();
  if (!status.value) {
    await leaderBoardStore.getLeaderBoardAction(1, setParrams(tags.value), status.value);
  }
  id.value = item.id;
  await router.push(
    route.query && route.query.type
      ? `leaderboard?table=${item.id}&type=${route.query.type}`
      : `leaderboard?table=${item.id}`,
  );
};
watch(
  () => route.query.table,
  (value) => {
    if (route.query.table) {
      setTable({ id: +value });
    } else {
      setTable({ id: 0 });
    }
  },
);

watch(
  () => route.query.type,
  (value) => {
    addTags({ id: +value, type: 'activity_id' });
  },
);

watch(
  () => filterId.value,
  (value) => {
    router.push(`leaderboard?table=${id.value}&type=${value}`);
  },
);
const leaderBoardRows = computed(
  () => {
    const tasksArray = talents.value.data;
    if (!tasksArray || (tasksArray && !tasksArray.length)) {
      return [];
    }
    return tasksArray.map((item) => {
      return {
        isTop: item.position <= 3,
        rank: {
          component: Rank,
          props: {
            value: item.position,
            isTop: item.position <= 3,
          },
        },
        talent: {
          component: Talent,
          props: {
            text: item.name,
            img: item.avatar ? item.avatar : defaultBg,
            reduceLength: 15,
            big: true,
          },
        },
        level: {
          component: Level,
          props: {
            level: item.level,
            text: item.level,
          },
        },
        qp: {
          content: item.tasks_points,
        },
        completed_tasks: {
          content: item.tasks_done,
        },
      };
    });
  },
  { dependsOn: [talents] },
);

const leaderBoardProjectsRows = computed(
  () => {
    const tasksArray = talents.value.data;
    if (!tasksArray || (tasksArray && !tasksArray.length) || !projects.value.length) {
      return [];
    }
    return tasksArray.map((item) => {
      return {
        isTop: item.position <= 3,
        rank: {
          component: Rank,
          props: {
            value: item.position,
            isTop: item.position <= 3,
          },
        },
        credits: {
          content: item.credits ? item.credits : '0',
        },
        talent: {
          component: Talent,
          props: {
            text: item.name,
            img: item.avatar ? item.avatar : defaultBg,
            reduceLength: 15,
            big: true,
          },
        },
        level: {
          component: Level,
          props: {
            level: item.level,
            text: item.level,
          },
        },
        qp: {
          content: item.tasks_points,
        },
        completed_tasks: {
          content: item.tasks_done,
        },
      };
    });
  },
  { dependsOn: [talents] },
);
const myRank = computed(
  () => {
    const tasksArray = [talents.value.my_rank];
    if (!talents.value.my_rank) {
      return [];
    }
    return tasksArray.map((item) => {
      return {
        rank: {
          component: Rank,
          props: {
            value: item.position,
          },
        },
        talent: {
          component: Talent,
          props: {
            text: item.name,
            img: item.avatar ? item.avatar : defaultBg,
            reduceLength: 15,
            big: true,
          },
        },
        level: {
          component: Level,
          props: {
            level: item.level,
            text: item.level,
          },
        },
        qp: {
          content: item.tasks_points,
        },
        completed_tasks: {
          content: item.tasks_done,
        },
      };
    });
  },
  { dependsOn: [talents] },
);
</script>

<style lang="scss" scoped>
.clear-filtrers {
  width: 71px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: $default-badge-border;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    font-feature-settings: 'zero' on;
    color: $secondary;
  }
}
.toggles_wrapper {
  width: 100%;
  display: flex;
  gap: 8px;
}

.filters_wrapper {
  width: 100%;
  display: flex;
  gap: 8px;
}

.filters {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
  gap: 16px;
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
.tags-block {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    margin-right: 12px;
    hanging-punctuation: first last;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
    color: $default;
  }
  .clear {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $secondary;
    &:hover {
      cursor: pointer;
    }
  }
}
.tag {
  display: flex;
  align-items: center;
  background: $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  &:hover {
    cursor: pointer;
    background: $colabs-bg;
    color: $white;
    box-shadow: 0px 2px 8px rgba(56, 64, 91, 0.16);
  }
}

.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}

.controller-talents {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  max-width: 100vw;
  width: 100%;
  z-index: 999999;
  left: 0;
  height: 72px;
  padding: 16px 40px;
  align-items: center;
  gap: 16px;
  border-top: 1px solid $default-border;
  background: $white;
  box-shadow: 0px 4px 16px 0px rgba(56, 64, 91, 0.24);
  .counts {
    color: $section-title;
    font-size: 16px;
    font-family: 'Basis Grotesque Pro';
    line-height: 24px;
  }
  .controllers {
    display: flex;
    align-items: center;
    gap: 12px;
    .remove {
      color: $red;
      font-size: 16px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 24px;
    }
    .invite {
      display: flex;
      height: 40px;
      padding: 7px 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: $orange;
      color: $white;
      font-size: 16px;
      font-family: 'Basis Grotesque Pro';
      font-weight: 500;
      line-height: 24px;
      &:hover {
        cursor: pointer;
        background: $orange-active;
      }
    }
  }
}
.line {
  align-self: stretch;
  height: 32px;
  border: 0.25px solid $default-badge-border;
}
</style>
