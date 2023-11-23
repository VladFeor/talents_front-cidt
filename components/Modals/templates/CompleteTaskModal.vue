<template>
  <div class="rework-modal">
    <div class="rework-modal_content mb-3">
      <div class="rework-modal_title">Completion of the Task</div>
      <div class="rework-modal_message">
        <div class="rework-modal_message-title">Message</div>
        <div class="rework-modal_message-subtitle">Comment on your problem solution.</div>
        <TextArea v-model="description" />
      </div>
      <div class="rework-modal_message">
        <Input name="Link" v-model="url" />
      </div>
      <div class="file-upload_wrapper">
        <div class="rework-modal_message-title">File</div>
        <div class="upload-requirements">
          Attach up to 3 files. PNG, JPEG, PDF. Minimum file size 10 KB, maximum 10 MB.
        </div>
        <CustomUpload
          @changeError="handleImageError"
          :imagesFiles="images"
          @images="images = $event"
        />
      </div>
    </div>
    <div class="rework-modal_btn">
      <BaseButton text="Submit for Review" type="normal" @click="finishTask" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '~/store/auth';
import { useTasksStore } from '~/store/tasks';
import { link } from '@/util/validations';
import axiosService from '~/service/axiosService';
const nuxtApp = useNuxtApp();
const authStore = useAuthStore();
const tasksStore = useTasksStore();

const emit = defineEmits(['action', 'input', 'close']);
const props = defineProps({
  taskId: { type: Number, default: null },
});
const description = ref('');
const isImagesError = ref(false);
const url = ref('');
const images = ref([]);

watch(description, (value) => {
  if (value) {
    emit('input', value);
  }
});

const handleImageError = (event) => {
  isImagesError.value = event;
};

const validLink = () => {
  if (url.value) {
    const links = url.value.match(/https?:\/\/\S+/g);
    return link().test(url.value) && url.value.length <= 255 && links.length === 1;
  } else {
    return false;
  }
};
function finishTask() {
  if (validLink() || images.value.length) {
    const formData = new FormData();
    if (validLink()) {
      formData.append('link', url.value);
    }
    if (description.value) {
      formData.append('message', description.value);
    }
    if (images.value.length) {
      images.value.map((file) => {
        formData.append('files[]', file.raw);
      });
    }
    axiosService
      .post(useRuntimeConfig().public.apiBase + `v2/user-tasks/report/${props.taskId}`, formData)
      .then(() => {
        tasksStore.getUserTaskAction(props.taskId);
        nuxtApp.$alert.show(`In progress`, {
          type: 'success',
          timeout: 5000,
        });

        emit('close');

        window.dataLayer.push({
          event: 'talent_task_submission',
        });
      })
      .catch((error) => {
        console.log(error);
        nuxtApp.$alert.show(error.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
      });
  } else {
    nuxtApp.$alert.show('Wrong URL', {
      type: 'error',
      timeout: 5000,
    });
  }
}
</script>

<style lang="scss" scoped>
.file-upload_wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.upload-requirements {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  margin-bottom: 8px;
}
.rework-modal {
  height: 96vh;
  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  justify-content: space-between;
  flex-direction: column;
  padding: 40px;
  &_content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 40px;
  }
  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: #1a1d29;
  }
  &_message {
    display: flex;
    flex-direction: column;
    gap: 5px;
    &-title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #1a1d29;
    }
    &-subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
  &_btn {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
