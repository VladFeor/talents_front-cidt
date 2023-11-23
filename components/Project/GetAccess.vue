<template>
  <BaseModal
    :visible="questions"
    @close="$router.push('/projects')"
    width="480"
    :top="success ? 180 : 140"
  >
    <div class="modal">
      <div class="flex flex-col items-center gap-[24px]" v-if="!success">
        <div class="title">Get Access to the Project</div>
        <div class="description">To access the project, Q&A Request must be send</div>
        <div class="questions">
          <div class="flex items-center gap-[8px]">
            <Icon name="QA" :size="24"></Icon>
            <div class="block-title">Q&A Request</div>
          </div>
          <div class="max-h-[256px] overflow-y-auto flex flex-col w-full gap-y-[16px]">
            <Question
              v-for="(i, idx) in res"
              :key="idx"
              v-model="i.value"
              :question="i.question"
              :index="idx + 1"
            ></Question>
          </div>
        </div>
        <BaseButton text="Send" type="normal" @click="check" :disabled="disabled"></BaseButton>
      </div>
      <div v-else class="flex flex-col items-center gap-[24px]">
        <div class="title">Get Access to the Project</div>
        <div class="description" v-if="success === true">Your request sent successfully</div>
        <div class="description" v-else-if="success === 'review'">
          Your have already request access to the project, wait for the project approval
        </div>
        <Success></Success>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import AxiosService from '~/service/axiosService';

const nuxtApp = useNuxtApp();
const disabled = ref(true);
const props = defineProps({
  project: {
    type: Object,
    default: () => {},
  },
});
const questions = computed(() => {
  if (props.project && props.project.survey_form && props.project.survey_form.questions) {
    return props.project.survey_form.questions.map((i) => {
      return {
        question: i.value,
        question_id: i.id,
        value: '',
      };
    });
  }
});
const res = ref(questions.value);
const success = ref(
  props.project.survey_form.meta_status && props.project.survey_form.meta_status !== 'created',
);

const check = () => {
  if (!disabled.value) {
    AxiosService.post(useRuntimeConfig().public.apiBase + 'survey/answers', {
      survey_form_id: props.project.survey_form.id,
      answers: res.value,
    })
      .then(() => {
        success.value = true;
      })
      .catch((e) => {
        if (e.response.data.errors) {
          const parseErrors = Object.values(e.response.data.errors);
          parseErrors.forEach((errorItem) => {
            nuxtApp.$alert.show(errorItem.join('\n'), {
              type: 'error',
              timeout: 5000,
            });
          });
        } else {
          nuxtApp.$alert.show(e.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        }
      });
  }
};
watch(res.value, (newQuestions) => {
  disabled.value = !newQuestions.every((i) => i.value.trim() && i.value.length <= 255);
});
</script>
<style scoped lang="scss">
.modal {
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}
.title {
  color: $section-title;
  font-variant-numeric: slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 40px; /* 166.667% */
}
.description {
  color: $section-title;
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums slashed-zero;
  font-family: 'Basis Grotesque Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
}
.questions {
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid $default-border;
  background: $default-badge-border;
  .block-title {
    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
}
</style>
