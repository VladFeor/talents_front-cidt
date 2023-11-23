<template>
  <div class="working-talents">
    <div class="working-talents_title"><span>Talents Working on the Task</span></div>
    <FilterToggle
      :buttons="workingTalentsOptions"
      :id="0"
      @select="setIsShowWorkingTalent($event)"
      btnLight
    />
    <div class="working-talents_cards">
      <div v-if="talents && talents.length" class="working-talents_card">
        <Talent v-for="talent in talents" :key="talent.id" :text="talent.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosService from '~~/service/axiosService';
import { ref, onMounted } from 'vue';

onMounted(() => {
  if (props.taskId) {
    getTalents();
  }
});

const props = defineProps({
  taskId: { type: Number, default: null },
});

const selectedTalent = ref(0);
const talents = ref([]);

const setIsShowWorkingTalent = (items) => {
  if (items.id == 0) {
    talents.value = [];
    getTalents();
  }
  if (items.id == 1) {
    talents.value = [];
    getTalents('in_progress');
  }
  if (items.id == 2) {
    talents.value = [];
    getTalents('waiting_for_review');
  }
  selectedTalent.value = items.id;
};

const getTalents = async (status) => {
  const params = {};

  if (status) {
    params.status = status;
  }

  const { data } = await axiosService.get(
    useRuntimeConfig().public.apiBase + `tasks/${props.taskId}/talents-working`,
    params,
  );
  talents.value = data;
};

const workingTalentsOptions = [
  {
    title: `All`,
    id: 0,
    name: 'All',
  },
  {
    title: `In Progress`,
    id: 1,
    name: 'In Progress',
  },
  {
    title: `Waiting for Review`,
    id: 2,
    name: 'Waiting for Review',
  },
];
</script>

<style lang="scss" scoped>
.working-talents {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  &_title {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 24px;
      line-height: 40px;
      color: $section-title;
    }
  }
  &_cards {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  &_card {
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
    padding: 8px 12px;
  }
}
</style>
