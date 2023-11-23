<template>
  <ChartSkeleton v-if="statisticChartLoading" />
  <chart-card style="height: 422px" :class="{ 'd-none': statisticChartLoading }">
    <div class="flex justify-between controler">
      <div class="flex gap-3 w-3/4">
        <BadgeToggle
          big
          :buttons="types"
          :id="type"
          @select="
            type = $event;
            getChartInfo();
          "
        ></BadgeToggle>
      </div>
      <div>
        <InfoToggle
          :buttons="datesChars"
          :id="2"
          @select="
            period = $event;
            getChartInfo();
          "
        ></InfoToggle>
      </div>
    </div>
    <BaseLineChart
      v-if="
        chartData &&
        chartData.labels &&
        chartData.labels.length &&
        chartData.data &&
        chartData.data.length &&
        renderComponent &&
        !statisticChartLoading &&
        !isEmptyChart
      "
      :data="chartData.data"
      :labels="chartData.labels"
    ></BaseLineChart>
    <EmptyChart v-else title="No data yet" icon="icons8-futurama-amy-wong" />
  </chart-card>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useDashboardStore } from '~/store/dashboard';

const dashboardStore = useDashboardStore();
const statisticChartLoading = computed(() => dashboardStore.getStatisticChartLoading);

onMounted(() => {
  getChartInfo();
});

const datesChars = [
  { title: 'D', id: 'd' },
  { title: 'W', id: 'w' },
  { title: 'M', id: 'm' },
  { title: 'Q', id: 'm3' },
  { title: 'Y', id: 'y' },
];

const isEmptyChart = computed(() => {
  const arr = chartData.value.data.map((item) => {
    return item.data.filter((i) => i === 0).length === item.data.length;
  });

  if (arr.length) {
    return arr.filter((i) => i !== false).length === arr.length;
  } else {
    return false;
  }
});

const types = [
  {
    title: 'Completed Tasks',
    id: 'completed_tasks',
  },
  {
    title: 'Joined Projects',
    id: 'joined_projects',
  },
  {
    title: 'Quality Points',
    id: 'experience',
  },
];

let type = 'completed_tasks';
let period = ref('m');
const dataComputed = computed(() => dashboardStore.getStatisticChart);
const chartData = computed(
  () => {
    const original = dataComputed.value;

    if (original) {
      return {
        data: [
          {
            fill: true,
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx;
              const gradient = canvas.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, '#DAD9F7');
              gradient.addColorStop(0.7, 'rgba(218, 217, 247, 0)');
              gradient.addColorStop(1, 'rgba(218, 217, 247, 0)');
              return gradient;
            },
            borderColor: '#AAA7CC',
            data: original.data,
            pointStyle: 'circle',
            pointRadius: 1,
          },
        ],
        labels: original.labels,
      };
    } else return null;
  },
  { dependsOn: [dataComputed] },
);
const renderComponent = ref(true);

const forceRender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
};
const getChartInfo = async () => {
  await dashboardStore.getStatisticChartAction(type, period.value);
  await forceRender();
};
</script>

<style scoped>
.controler {
  margin-bottom: 24px;
}
.d-none {
  display: none;
}
</style>
