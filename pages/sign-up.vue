<template>
  <div class="main" v-if="!isMessageModalActive">
    <span class="title">Welcome to Talentum!</span>
    <span class="create-account-text"
      >Create an account. Already have an account?
      <nuxt-link to="login" class="link">Sign in</nuxt-link></span
    >
    <div class="form-block">
      <form @submit.prevent="register">
        <EmailInput
          class="mt-30"
          v-model="email"
          placeholder="Enter your email address"
          @error="emailInvalid = $event"
          :invalid="emailInvalid"
        />
        <PasswordInput
          class="mt-30"
          v-model="password"
          placeholder="Create a password"
          name="Password"
        />
        <PasswordValidation @validation="pswdValid = $event" :password="password" />
        <PasswordInput
          v-model="confirmation"
          :rule="confirmation !== password"
          name=""
          error="Passwords don’t match. Try again"
          placeholder="Password Confirmation"
        ></PasswordInput>
        <AuthButton class="mt-30" text="Join Talentum" type="submit" />
      </form>
      <div class="social mt-30">
        <div class="or">
          <div />
          <span class="w-1/2">Or create an account with</span>
          <div />
        </div>
        <div class="socials-btn">
          <SocialButton
            v-for="i in socialButtons"
            :icon="i.icon"
            :key="i.id"
            @click="i.fn()"
          ></SocialButton>
        </div>
      </div>
    </div>
    <span class="create-account-text mt-30">
      By proceeding, you agree to
      <nuxt-link to="sign-up" class="link">Terms of Service</nuxt-link> &
      <nuxt-link to="sign-up" class="link">Privacy Policy</nuxt-link>.
    </span>
  </div>
  <div v-else class="reg-message_wrapper no-padd">
    <div class="reg-message-title">Verification by mail</div>
    <div class="reg-message">
      A letter with a link to confirm your email address <span>{{ email }}</span> has been sent to
      the specified address. Please check your email and follow the link to complete the
      verification process.
    </div>
    <div class="reg-message_social">
      <div class="reg-message_social_title">
        <div class="reg-message_line" />
        <span>Or create an account with</span>
        <div class="reg-message_line" />
      </div>
      <div class="reg-message_socials-btn">
        <SocialButton
          v-for="i in socialButtons"
          :icon="i.icon"
          :key="i.id"
          @click="i.fn()"
        ></SocialButton>
      </div>
    </div>
  </div>
  <!-- <BaseModal
    :width="520"
    top="230"
    @close="handleShowMessageModalActive($event)"
    :visible="isMessageModalActive"
    isScrollOff
  >
    <div class="reg-message_wrapper">
      <div class="reg-message-title">Verification by mail</div>
      <div class="reg-message">
        A letter with a link to confirm your email address <span>{{ email }}</span> has been sent to
        the specified address. Please check your email and follow the link to complete the
        verification process.
      </div>
      <div class="reg-message_social">
        <div class="reg-message_social_title">
          <div class="reg-message_line" />
          <span>Or create an account with</span>
          <div class="reg-message_line" />
        </div>
        <div class="reg-message_socials-btn">
          <SocialButton
            v-for="i in socialButtons"
            :icon="i.icon"
            :key="i.id"
            @click="i.fn()"
          ></SocialButton>
        </div>
      </div>
    </div>
  </BaseModal> -->
  <BaseModal
    :width="520"
    top="320"
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
</template>

<script setup>
import AxiosService from '@/service/axiosService';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useUserStore } from '~/store/user';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ethers } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WalletConnectorV2 } from '~/wallets//wallet-connect-v2';
import { WalletTron } from '~/wallets//wallet-tron';
import { WalletAptosPetra } from '~/wallets/wallet-aptos-petra';
import nacl from 'tweetnacl';
import { ConnectionType } from '~/web3/connection';
// import { Buffer } from 'buffer';

const status = ref(null);

const email = ref('');
const password = ref('');
const confirmation = ref('');
const pswdValid = ref(false);
const emailInvalid = ref(true);
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const currentAccount = ref(null);
const signature = ref(null);
const isMessageModalActive = ref(false);
const isSuccessfullMessageModalActive = ref(false);
const nuxtApp = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
if (typeof global === 'undefined') {
  window.global = window;
}

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
definePageMeta({ layout: 'auth' });
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
      console.log(signature.value);
      const stdSignature = await COMPASS_WALLET.signArbitrary(
        'atlantic-2',
        SEI_ADDRESS,
        signature.value.message,
      );

      console.log(stdSignature.signature, signature.value.session_id);
      // const isVerified = await verifyArbitrary(SEI_ADDRESS, signature.value.message, stdSignature);
      // console.log(isVerified);
      // if (isVerified) {
      await login(stdSignature.signature, signature.value.session_id);
      // }
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
      console.log(e);
    });
};

const handleShowMessageModalActive = (event) => {
  isMessageModalActive.value = event;
};
const handleShowSuccessfullMessageModalActive = (event) => {
  isSuccessfullMessageModalActive.value = event;
};

onMounted(async () => {
  const route = useRoute();
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
      console.log(e);
      localStorage.social = '';
    });
};
const connectTron = async () => {
  localStorage.removeItem('account');
  localStorage.removeItem('walletconnect');
  const wallet = new WalletTron();
  console.log('wallet', wallet);
  const connectedWallet = await wallet.connect();
  console.log('connectedWallet', connectedWallet);
  const provider = connectedWallet.getProvider();
  console.log('provider', provider);

  const account = connectedWallet.getAccount();

  console.log('account', account);

  localStorage.setItem('account', account);
  currentAccount.value = account;

  try {
    const { data } = await axios.post(runtimeConfig.public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.TRONLINK,
    });

    signature.value = data;
    const signature_new = await provider.trx.sign(signature.value.message);
    console.log('signature_new', signature_new);
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

    // const { publicKey } = await window.aptos.account();

    // const key = publicKey.slice(2, 66);

    // const verified = nacl.sign.detached.verify(
    //   Buffer.from(signature_new.fullMessage),
    //   Buffer.from(signature_new.signature, 'hex'),
    //   Buffer.from(key, 'hex'),
    // );
    // console.log('verified', verified);
    // if (verified) {
    login(signature_new.signature, signature.value.session_id);

    // }
  } catch (error) {
    console.log('error', error);
    nuxtApp.$alert.show(error.response.data.message, {
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

  axios
    .post(runtimeConfig.public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.WALLET_CONNECT,
    })
    .then(async (response) => {
      signature.value = response.data;
      const signer = provider.getSigner();
      const signature_new = await signer.signMessage(signature.value.message);
      login(signature_new, signature.value.session_id);
    })
    .catch((e) => {
      nuxtApp.$alert.show(e.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
      console.log(e);
    });
};
const connectMM = async () => {
  localStorage.removeItem('account');

  const { ethereum } = window;
  try {
    if (!ethereum) {
      window.open('https://metamask.io/', '_blank');
      return;
    }
    console.log(window.ethereum);
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
    nuxtApp.$alert.show(e.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
    console.log(e);
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
      console.log(response.data);
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

async function register() {
  if (emailInvalid.value) {
    nuxtApp.$alert.show('Email field is entered incorrectly.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  if (!pswdValid.value || confirmation.value !== password.value) {
    nuxtApp.$alert.show('Password fields are entered incorrectly.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/validate-email', {
    email: email.value,
  })
    .then(async () => {
      emailInvalid.value = false;
      try {
        const data = {
          email: email.value,
          password: password.value,
          password_confirmation: confirmation.value,
        };
        await authStore.register(data);
        isMessageModalActive.value = true;

        // setTimeout(() => {
        //   if (localStorage.ref && localStorage.projectId) {
        //     router.push(`/projects/${localStorage.projectId}/?ref=${localStorage.ref}`);
        //   } else {
        //     router.push('/');
        //   }
        // }, 1000);
      } catch (e) {
        isMessageModalActive.value = false;
        const parseErrors = Object.values(e.errors);
        parseErrors.forEach((errorItem) => {
          nuxtApp.$alert.show(errorItem.join('\n'), {
            type: 'error',
            timeout: 5000,
          });
        });
      }
    })
    .catch(() => {
      emailInvalid.value = true;
      nuxtApp.$alert.show(
        'This email address is already registered. Please log in to your account or use a different email address.',
        {
          type: 'error',
          timeout: 5000,
        },
      );
    });
}
</script>

<style scoped lang="scss">
.reg-message_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 10px;
  padding: 34px 50px;
  &.no-padd {
    padding: 0;
  }
}
.reg-message {
  // padding: 24px;

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
.mt-30 {
  margin-top: 30px;
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
    }
  }
}
</style>
