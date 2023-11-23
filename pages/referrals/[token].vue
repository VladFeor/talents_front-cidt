<script setup>
import AxiosService from '~/service/axiosService';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const showModal = ref(false);
onMounted(() => {
  AxiosService.get(useRuntimeConfig().public.apiBase + `invitations/parse/${route.params.token}`)
    .then((res) => {
      console.log(res);
      router.push(`/projects/${res.data.project_id}`);
    })
    .catch((e) => {
      showModal.value = true;
      console.error(e);
    });
});
</script>
<template>
  <InaccessibleLinkModal
    v-if="showModal"
    title="Project Unavailable"
    text="The project you are trying to access is no longer available. It may have been made private or deleted. For further assistance, contact your project manager or administrator."
    link="/"
    button="Go to the Homepage"
  ></InaccessibleLinkModal>
</template>
<style lang="scss" scoped>
.modal-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  flex-direction: column;
  font-family: 'Basis Grotesque Pro';

  .title {
    color: $section-title;
    text-align: center;
    font-variant-numeric: slashed-zero;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
  }

  .description {
    color: $section-title;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
</style>
