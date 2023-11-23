Copy code
<template>
  <div class="main">
    <span class="title">GM, Talent!</span>
    <span class="create-account-text">
      Don’t have an account? <span @click="toSignup" class="link cursor-pointer">Sign up</span>
      <!-- Don’t have an account? <nuxt-link to="sign-up" class="link">Sign up</nuxt-link> -->
    </span>
    <div class="form-block">
      <form @submit.prevent="loginWithEmail">
        <EmailInput
          class="mt-40"
          v-model="email"
          placeholder="Enter your email address"
          @error="error = $event"
        />
        <PasswordInput
          class="mt-40"
          v-model="password"
          placeholder="Enter your password"
          name="Password"
          forgot
        />
        <AuthButton class="mt-40" text="Sign In" type="submit" />
      </form>
      <div class="social mt-40">
        <div class="or">
          <div />
          <span class="w-1/2">Or create an account with</span>
          <div />
        </div>
        <div class="socials-btn">
          <SocialButton v-for="i in socialButtons" :icon="i.icon" :key="i.id" :fn="i.fn" />
        </div>
      </div>
    </div>
  </div>
  <BaseModal
    :width="520"
    @close="handleShowSuccessfullMessageModalActive($event)"
    :visible="isSuccessfullMessageModalActive"
    isScrollOff
  >
    <div class="reg-message_wrapper">
      <div class="reg-message-title">Successfull Verification</div>
      <div class="reg-message" v-if="status === 'success'">
        Your email address has been successfully confirmed! Now you can log in to your account and
        start using all the features of the website.
      </div>
      <div class="reg-message" v-if="status === 'confirmed'">
        This email address has already been confirmed. Please log in to your account..
      </div>
    </div>
  </BaseModal>
  <BaseModal
    :width="520"
    top="320"
    @close="handleShowRecentMessageModalActive($event)"
    :visible="isRecentMessageModalActive"
    isScrollOff
  >
    <div class="reg-message_wrapper">
      <div class="reg-message-title">Not verified email</div>

      <BaseButton text="Recent verification link" type="normal" @click="sentVerificationLink" />
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ethers } from 'ethers';
import { WalletConnectorV2 } from '~/wallets//wallet-connect-v2';
import { WalletTron } from '~/wallets//wallet-tron';
import { WalletAptosPetra } from '~/wallets//wallet-aptos-petra';

import { useUserStore } from '~/store/user';
if (typeof global === 'undefined') {
  window.global = window;
}

const email = ref('');
const password = ref('');
const error = ref(true);
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const nuxtApp = useNuxtApp();
const currentAccount = ref(null);
const signature = ref(null);
const isSuccessfullMessageModalActive = ref(false);
const isRecentMessageModalActive = ref(false);
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
import { COMPASS_WALLET, verifyArbitrary } from '@sei-js/core';
import AxiosService from '~/service/axiosService';
import { ConnectionType } from '~/web3/connection';
const socialButtons = ref([
  { id: 0, icon: 'MetaMask', fn: () => connectMM() },
  { id: 1, icon: 'WalletConnect', fn: () => connect() },
  { id: 2, icon: 'Tron-Default', fn: () => connectTron() },
  { id: 3, icon: 'Google', fn: () => socialAuth('google') },
  { id: 4, icon: 'Twitter', fn: () => socialAuth('twitter') },
  { id: 5, icon: 'Discord', fn: () => socialAuth('discord') },
  { id: 6, icon: 'Reddit', fn: () => socialAuth('reddit') },
  { id: 7, icon: 'Compass-Circle', fn: () => connectCompass() },
  { id: 8, icon: 'Aptos', fn: () => connectAptosPetra() },
]);
const connectCompass = async () => {
  await COMPASS_WALLET.connect('atlantic-2');
  const accounts = await COMPASS_WALLET.getAccounts('atlantic-2');
  if (!accounts.length) {
    return window.open(
      'https://chrome.google.com/webstore/detail/compass-wallet-for-sei/anokgmphncpekkhclmingpimjmcooifb',
      '_blank',
    );
  }
  const SEI_ADDRESS = accounts[0].address;

  axios
    .post(runtimeConfig.public.apiBase + `auth/signature`, {
      address: SEI_ADDRESS,
      type: ConnectionType.COMPASS,
    })
    .then(async (response) => {
      signature.value = response.data;
      const stdSignature = await COMPASS_WALLET.signArbitrary(
        'atlantic-2',
        SEI_ADDRESS,
        signature.value.message,
      );

      await login(stdSignature.signature, signature.value.session_id);
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
      console.log(e);
    });
};
const sentVerificationLink = async () => {
  try {
    await AxiosService.post(useRuntimeConfig().public.apiBase + 'email/verification-notification');
    isRecentMessageModalActive.value = false;
  } catch (error) {
    isRecentMessageModalActive.value = false;
    console.log('sentVerificationLink error', error);
  }
};

const toSignup = () => {
  window.location.href = '/sign-up';
};

const handleShowSuccessfullMessageModalActive = (event) => {
  isSuccessfullMessageModalActive.value = event;
};

const handleShowRecentMessageModalActive = (event) => {
  isRecentMessageModalActive.value = event;
};
const status = ref(null);
definePageMeta({ layout: 'auth' });
onMounted(async () => {
  if (
    (route.query && route.query.code && route.query.code === 'success') ||
    (route.query && route.query.code && route.query.code === 'confirmed')
  ) {
    status.value = route.query.code;
    isSuccessfullMessageModalActive.value = true;
  }
  if (localStorage.social && route.query) {
    axios
      .get(useRuntimeConfig().public.apiBase + `auth/${localStorage.social}/callback/`, {
        params: route.query,
      })
      .then(async (response) => {
        await authStore.setToken(response.data.access_token);
        await userStore.userInfo(response.data.access_token);
        if (localStorage.ref && localStorage.projectId && localStorage.ref != 'undefined') {
          await router.push(`/projects/${localStorage.projectId}/?ref=${localStorage.ref}`);
        } else {
          await router.push('/');
        }
        // await router.push('/');
        localStorage.social = '';
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      });
  }
});
const socialAuth = async (social) => {
  axios
    .get(runtimeConfig.public.apiBase + `auth/${social}/redirect/`)
    .then(async (response) => {
      localStorage.social = social;
      window.location.href = response.data.redirect_url;

      window.dataLayer.push({
        event: 'talent_user_login',
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
      localStorage.social = '';
    });
};

const connectTron = async () => {
  localStorage.removeItem('account');
  localStorage.removeItem('walletconnect');

  const wallet = new WalletTron();
  const connectedWallet = await wallet.connect();
  const provider = connectedWallet.getProvider();
  const account = connectedWallet.getAccount();

  localStorage.setItem('account', account);
  currentAccount.value = account;

  try {
    const { data } = await axios.post(runtimeConfig.public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.TRONLINK,
    });

    signature.value = data;
    const signature_new = await provider.trx.signMessageV2(signature.value.message);
    login(signature_new, signature.value.session_id);
  } catch (e) {
    nuxtApp.$alert.show(e.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
    localStorage.social = '';
  }
};

const connect = async () => {
  localStorage.removeItem('account');
  localStorage.removeItem('walletconnect');
  const wallet = new WalletConnectorV2();
  const connectedWallet = await wallet.connect();
  const provider = connectedWallet.getProvider();

  const account = connectedWallet.getAccount();

  localStorage.setItem('account', account);
  currentAccount.value = account;

  try {
    const { data } = await axios.post(runtimeConfig.public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.WALLET_CONNECT,
    });

    signature.value = data;
    const signer = provider.getSigner();
    const signature_new = await signer.signMessage(signature.value.message);
    login(signature_new, signature.value.session_id);
  } catch (e) {
    nuxtApp.$alert.show(e.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
    localStorage.social = '';
  }
};
const connectAptosPetra = async () => {
  localStorage.removeItem('account');
  localStorage.removeItem('walletconnect');
  const wallet = new WalletAptosPetra();
  const connectedWallet = await wallet.connect();
  const provider = connectedWallet.getProvider();

  const account = connectedWallet.getAccount();

  localStorage.setItem('account', account);
  currentAccount.value = account;

  try {
    const { data } = await axios.post(runtimeConfig.public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.APTOS_PETRA,
    });

    signature.value = data;

    const nonce = 'random_string';

    const signature_new = await provider.signMessage({
      message: signature.value.message,
      nonce,
    });

    login(signature_new.signature, signature.value.session_id);

  } catch (error) {
    console.log('error', error);
    nuxtApp.$alert.show(error.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
    localStorage.social = '';
  }
};

const connectMM = async () => {
  localStorage.removeItem('account');

  const { ethereum } = window;

  try {
    if (!ethereum) {
      window.open('https://metamask.io/', '_blank');
      return;
    }

    const providerMM = window.ethereum.providers
      ? window.ethereum.providers.find((provider) => provider.isMetaMask)
      : window.ethereum;
    const accounts = await providerMM.request({
      method: 'eth_requestAccounts',
    });

    localStorage.setItem('account', accounts[0]);
    currentAccount.value = accounts[0];

    axios
      .post(runtimeConfig.public.apiBase + `auth/signature`, {
        address: currentAccount.value,
        type: ConnectionType.METAMASK,
      })
      .then(async (response) => {
        signature.value = response.data;
        const provider = new ethers.providers.Web3Provider(providerMM);
        provider.send('eth_requestAccounts', []);
        const address = await provider.getSigner();
        const signature_new = await address.signMessage(signature.value.message);

        login(signature_new, signature.value.session_id);
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        console.log(e);
      });
  } catch (e) {
    console.log('connectMM error', e);

    nuxtApp.$alert.show(e.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
  }
};
const login = async (signature, session_id) => {
  axios
    .post(runtimeConfig.public.apiBase + 'auth/verify-signature', {
      // address: currentAccount.value,
      session_id,
      signature: signature,
    })
    .then(async (response) => {
      await authStore.setToken(response.data.access_token);
      await userStore.userInfo(response.data.access_token);
      if (localStorage.ref && localStorage.projectId && localStorage.ref != 'undefined') {
        await router.push(`/projects/${localStorage.projectId}/?ref=${localStorage.ref}`);
      } else {
        await router.push('/');
      }

      window.dataLayer.push({
        event: 'talent_user_login',
      });
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
      console.log(e);
    });
};
async function loginWithEmail() {
  if (!password.value || error.value) {
    nuxtApp.$alert.show('Some fields are entered incorrectly.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  try {
    const data = {
      email: email.value,
      password: password.value,
    };
    const { data: loginData } = await axios.post(useRuntimeConfig().public.apiBase + 'auth/login', {
      email: data.email,
      password: data.password,
    });
    const { data: userData } = await axios.get(useRuntimeConfig().public.apiBase + `auth/me`, {
      headers: {
        Authorization: `Bearer ${loginData.access_token}`,
      },
    });
    await authStore.login(data);

    if (localStorage.ref && localStorage.projectId && localStorage.ref != 'undefined') {
      await router.push(`/projects/${localStorage.projectId}/?ref=${localStorage.ref}`);
    } else {
      await router.push({ path: '/' });
    }
  } catch (e) {
    console.log(e);
    isSuccessfullMessageModalActive.value = false;
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
  }
}
</script>

<style scoped lang="scss">
.reg-message_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 34px 50px;
}
.reg-message {
  color: #1a1d29;
  font-variant-numeric: lining-nums tabular-nums ordinal slashed-zero;
  font-feature-settings: 'dlig' on, 'ss04' on;
  font-family: Basis Grotesque Pro;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 8px;
  span {
    color: #fc660c;
  }
  &-title {
    color: #1a1d29;
    text-align: center;
    font-variant-numeric: slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
    margin-bottom: 50px;
  }
  &_social {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 100px;
    &_title {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      span {
        color: #6a6d8f;
        font-variant-numeric: lining-nums tabular-nums slashed-zero;
        /* Label */
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px; /* 133.333% */
        letter-spacing: 0.168px;
        white-space: nowrap;
      }
    }
  }
  &_socials-btn {
    display: flex;
    gap: 8px;
  }

  &_line {
    width: 100%;
    height: 1px;
    background-color: $default;
  }
}
.mt-40 {
  margin-top: 40px;
}
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
    @media screen and (max-width: 520px) {
      font-size: 28px;
    }
  }
  .create-account-text {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    align-items: center;
    .link {
      color: $orange;
      &:hover {
        color: $orange-active;
      }
    }
  }
  .form-block {
    display: flex;
    flex-direction: column;
    .social {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      .or {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        text-align: center;
        div {
          width: 50%;
          border: 0.5px solid $colabs-bg;
        }
        span {
          width: 100%;
          font-family: 'Basis Grotesque Pro';
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.014em;
          font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
          color: $secondary;
        }
      }
      .socials-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      @media screen and (max-width: 520px) {
        padding: 0;
        .socials-btn {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
      }
    }
  }
}
</style>
