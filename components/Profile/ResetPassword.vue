<template>
  <div v-if="!user.email_verified_at || !user.email">
    <div v-if="sent">
      <span class="title-msg"> Verification by email </span>
      <div class="first">
        <span>
          A letter with a link to confirm your email address
          <span class="link">{{ email }}</span> has been sent to the specified address. Please check
          your email and follow the link to complete the verification process.</span
        >
      </div>
    </div>
    <div v-else>
      <span class="title-msg">
        You don’t use an email address to login, <br />
        so you can add your email and create a password
      </span>
      <EmailInput v-model="email"></EmailInput>
      <div class="flex flex-col mt-3">
        <PasswordInput
          v-model="newPassword"
          placeholder="Create a new password"
          name="New Password"
          :rule="error"
        ></PasswordInput>
        <PasswordValidation
          @validation="valid = $event"
          :password="newPassword"
        ></PasswordValidation>
      </div>

      <div class="controllers">
        <div class="cancel" @click="$emit('close')">Cancel</div>
        <div class="confirm" @click="set()">Confirm</div>
      </div>
    </div>
  </div>

  <div v-else>
    <PasswordInput
      v-model="oldPassword"
      :rule="error"
      placeholder="Enter your password"
      name="Current Password"
    ></PasswordInput>
    <div class="flex flex-col mt-3">
      <PasswordInput
        v-model="newPassword"
        placeholder="Create a new password"
        name="New Password"
        :rule="error"
      ></PasswordInput>
      <PasswordValidation @validation="valid = $event" :password="newPassword"></PasswordValidation>
    </div>
    <PasswordInput
      placeholder="Repeat a password"
      :rule="confirmation !== newPassword || error"
      name=""
      v-model="confirmation"
    ></PasswordInput>
    <div class="controllers">
      <div class="cancel" @click="$emit('close')">Cancel</div>
      <div class="confirm" @click="reset()">Confirm</div>
    </div>
  </div>
</template>

<script setup>
import AxiosService from '~/service/axiosService';
import { useUserStore } from '~/store';
import { computed } from 'vue';
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const sent = ref(false);
const nuxtApp = useNuxtApp();
const emit = defineEmits(['close']);

const oldPassword = ref('');
const newPassword = ref('');
const confirmation = ref('');
const email = ref('');
const valid = ref(false);
const error = ref(false);
const reset = () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    input.focus();
    input.blur();
  });
  if (
    !oldPassword.value ||
    !newPassword.value ||
    !confirmation.value ||
    !valid.value ||
    oldPassword.value === newPassword.value
  ) {
    error.value = true;
    return;
  }
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + `profile/change-password `, {
    current_password: oldPassword.value,
    password: newPassword.value,
    password_confirmation: confirmation.value,
  })
    .then(() => {
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
      useUserStore().userInfo();
      emit('close');
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
        nuxtApp.$alert.show(e.response.data.error, {
          type: 'error',
          timeout: 5000,
        });
      }
    });
};
const set = () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    input.focus();
    input.blur();
  });
  if (!email.value || !newPassword.value || !valid.value) {
    error.value = true;
    return;
  }
  AxiosService.post(useRuntimeConfig().public.apiBaseV2 + `profile/change-password `, {
    email: email.value,
    password: newPassword.value,
    password_confirmation: newPassword.value,
  })
    .then(() => {
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
      useUserStore().userInfo();
      sent.value = true;
      //emit('close');
    })
    .catch((e) => {
      if (e.response.data.errors) {
        const parseErrors = Object.values(e.response.data.errors);
        parseErrors.forEach((errorItem) => {
          console.log(123);
          nuxtApp.$alert.show(errorItem.join('\n'), {
            type: 'error',
            timeout: 5000,
          });
        });
      } else {
        nuxtApp.$alert.show(e.response.data.error, {
          type: 'error',
          timeout: 5000,
        });
      }
    });
};
</script>

<style scoped lang="scss">
.controllers {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
  .cancel {
    width: 192px;
    height: 40px;
    padding: 8px 12px;
    background: $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }
  .confirm {
    width: 192px;
    height: 40px;
    padding: 8px 12px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    background: $orange;
    text-align: center;
    color: $white;
    border-radius: 8px;
    &:hover {
      cursor: pointer;
      background: $orange-active;
    }
  }
}

.title-msg {
  color: $section-title;
  text-align: center;
  /* Text Small */
  font-family: 'Basis Grotesque Pro';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.168px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  margin-bottom: 36px;
}

.first {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 16px;
  border: 1px solid $default-border;
  border-radius: 8px;
  background: $white;
  span {
    color: $section-title;
  }
  .link {
    text-decoration: none;
    color: $orange !important;
  }
}
</style>
