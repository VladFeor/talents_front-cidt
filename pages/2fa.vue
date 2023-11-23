<template>
  <div class="main">
    <span class="title">2-step Authentication</span>
    <span class="two-step-text">
      You have enabled two-step verification with confirmation using the Authenticator application
    </span>

    <TwoFactorAuth></TwoFactorAuth>
    <Checkbox class="check-box" label="Remember this device"></Checkbox>
    <AuthButton class="mt-40" text="Continue" @click="send" />
    <BackToLogin style="margin-top: 18px" text="Cancel" @click="backToLogin" />
    <span class="mt-40 alert-auth">Can’t find an authentication code in the app</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Checkbox from '../components/Checkbox/Checkbox';
const router = useRouter();

function backToLogin() {
  router.push('/login');
}
function send() {}
definePageMeta({ layout: 'auth' });
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: $section-title;
    margin-bottom: 8px;
  }
  .two-step-text {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $secondary;
    margin-top: 8px;
  }
}
.mt-40 {
  margin-top: 40px;
}
.alert-auth {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;

  color: $orange;
}
.check-box {
  margin: 35px auto 0;
}
</style>
