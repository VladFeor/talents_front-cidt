<template>
  <div class="container-delete">
    <span>Delete account and remove attached addresses. This action is irreversible.</span>
    <div @click="showModal()">Delete Account</div>
  </div>
  <Modal v-if="modal" @close="showModal()" class="modal-block" width="456">
    <div class="title">A you sure you want to delete your account?</div>
    <SmallProfileCard :data="talent" />
    <div class="description">
      Once you delete your account, it will no longer be accessible, and all associated addresses
      will be disconnected. This action cannot be undone.
    </div>
    <div class="confirmation-msg">Type "DELETE ACCOUNT" below to continue</div>
    <Input name="" placeholder="Type here" v-model="word" />
    <div class="controller gap-x-[16px]">
      <div class="cancel" @click="showModal()">Cancel</div>
      <div class="send" :class="{ blocked }" @click="remove()">Delete Account</div>
    </div>
  </Modal>
</template>
<script setup>
import { useUserStore } from '~/store';
import AxiosService from '~/service/axiosService';
import { useAuthStore } from '~/store/auth';

const modal = ref(false);
const word = ref('');
const userStore = useUserStore();
const blocked = computed(() => word.value !== 'DELETE ACCOUNT');
const talent = computed(() => userStore.getUser);
const router = useRouter();

const showModal = () => {
  modal.value = !modal.value;
};
const remove = () => {
  if (!blocked.value) {
    AxiosService.delete(useRuntimeConfig().public.apiBase + `auth/delete`).then(() => {
      useAuthStore().setToken('');
      router.push('/login');
    });
  }
};
</script>

<style scoped lang="scss">
.container-delete {
  display: flex;
  padding: 24px;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid $default-border;
  font-family: 'Basis Grotesque Pro';
  justify-content: space-between;
  span {
    color: $section-title;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
  div {
    border-radius: 8px;
    background: $error-border;
    display: flex;
    padding: 4px 8px;
    align-items: center;
    gap: 8px;
    color: $white;
    font-variant-numeric: slashed-zero;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;
  }
}
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
  .description,
  .confirmation-msg {
    color: $section-title;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
  .controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cancel {
      display: flex;
      padding: 8px 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: $default-border;
      color: $default;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-family: 'Basis Grotesque Pro';
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      width: 160px;
      cursor: pointer;
      line-height: 24px; /* 150% */
    }
    .send {
      cursor: pointer;
      width: 160px;
      display: flex;
      padding: 8px 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      background: $error-border;
      color: $white;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      &:hover {
        background: $red;
      }
    }
    .blocked {
      background: none;
      color: $colabs-bg;
      font-variant-numeric: lining-nums tabular-nums slashed-zero;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
      &:hover {
        background: none !important;
      }
    }
  }
}
</style>
