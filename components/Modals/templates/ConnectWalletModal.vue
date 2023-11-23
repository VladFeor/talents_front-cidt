<template>
  <div class="connect-wallet-container">
    <div v-if="isConnecting" class="wallet-connection">
      <h4>Connecting Your Wallet</h4>
      <p class="wallet-connection_cheking">Please sign the message in your wallet to continue</p>
      <Icon :name="connectorIcon" :size="88"/>
    </div>
    <div v-else-if="isError" class="failed-connection">
      <h4>Failed to Connect</h4>
      <div class="failed-connection_body">
        <img src="@/assets/icons/images/Bender.svg" alt="Bender">
        <p>Failed to connect your wallet for some reason, please try again</p>
      </div>
      <BaseButton :type="'normal'" :text="'Retry'" @click="handleRetry" />
    </div>
    <div class="connect-wallet-modal">
      <div class="connect-wallet-modal_title">Connect your wallet</div>
      <div class="connect-wallet-modal_subtitle">To continue, you need to connect your wallet</div>
      <div class="connect-wallet-modal_items">
        <div
          v-for="(connector, i) in connectors"
          :key="i"
          @click="connector.action"
          class="connect-wallet-modal_item"
        >
          <div class="connect-wallet-modal_item_wrapper">
            <img
              v-if="connector.icon === 'Tron-Default'"
              class="social-icon"
              :src="tronlink"
              alt=""
            />
            <img v-else-if="connector.icon === 'Aptos'" class="social-icon" :src="petra" alt="" />
            <Icon v-else :icon="connector.icon" :size="24"></Icon>
            <p>{{ connector.title }}</p>
          </div>
          <Icon class="arrow-color" icon="Right-Arrow" :size="24"></Icon>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ethers } from 'ethers';
import axiosService from '~/service/axiosService';
import { WalletConnectorV2 } from '~/wallets/wallet-connect-v2';
import { useUserStore } from '~/store/user';
import { WalletTron } from '~/wallets//wallet-tron';
import { COMPASS_WALLET, verifyArbitrary } from '@sei-js/core';
import { WalletAptosPetra } from '~/wallets/wallet-aptos-petra';
import nacl from 'tweetnacl';
import { ConnectionType } from '~/web3/connection';
import { useAddressStore } from '~/store/address';
import { petra, tronlink } from '@/constants/icons';

// import { Buffer } from 'buffer';

const userStore = useUserStore();
const addressStore = useAddressStore();

const nuxtApp = useNuxtApp();

const emit = defineEmits(['close', 'error']);

const isConnecting = ref(false);
const isError = ref(false);
const connectorIcon = ref('');

const signature = ref(null);
const currentAccount = ref(null);
const connectors = [
  {
    title: 'Metamask',
    icon: 'MetaMask',
    action: () => connectMM(),
  },
  {
    title: 'Walletconnect',
    icon: 'WalletConnect',
    action: () => connectWalletconnectV2(),
  },
  {
    title: 'TronLink',
    icon: 'Tron-Default',
    action: () => connectTron(),
  },
  {
    title: 'Compass',
    icon: 'Compass-Circle',
    action: () => connectCompass(),
  },
  {
    title: 'Petra',
    icon: 'Aptos',
    action: () => connectAptosPetra(),
  },
];

const handleRetry = () => {
  isError.value = false;
  isConnecting.value = false;
}

const connect = async (connector) => {
  if (connector?.action) {
    isConnecting.value = true
    connectorIcon.value = connector.icon
    connector.action().catch(() => {
      isError.value = true
    }
    )
      .finally(() => isConnecting.value = false)
  }
}

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
    const { data } = await axiosService.post(useRuntimeConfig().public.apiBase + `auth/signature`, {
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
    await login(signature_new.signature, signature.value.session_id);
    emit('close');
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

  axiosService
    .post(useRuntimeConfig().public.apiBase + `auth/signature`, {
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
      emit('close');
      // }
    })
    .catch((error) => {
      nuxtApp.$alert.show(error.response.data.message, {
        type: 'error',
        timeout: 5000,
      });
      console.log(error);
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
    const { data } = await axiosService.post(useRuntimeConfig().public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.TRONLINK,
    });

    signature.value = data;
    const signature_new = await provider.trx.signMessageV2(signature.value.message);
    await login(signature_new, signature.value.session_id);
    emit('close');
  } catch (e) {
    console.log('connectTron error', e);
    nuxtApp.$alert.show(e.response.data.message, {
      type: 'error',
      timeout: 5000,
    });
    localStorage.social = '';
    emit('error', true);
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
    axiosService
      .post(useRuntimeConfig().public.apiBase + `auth/signature`, {
        address: currentAccount.value,
        type: ConnectionType.METAMASK,
      })
      .then(async (response) => {
        emit('close');
        signature.value = response.data;
        const provider = new ethers.providers.Web3Provider(providerMM);
        provider.send('eth_requestAccounts', []);
        const address = provider.getSigner();
        const signature_new = await address.signMessage(signature.value.message);
        await login(signature_new, signature.value.session_id);
      })
      .catch((error) => {
        emit('error', true);
        if (error.response.status === 400) {
          nuxtApp.$alert.show(error.response.data.message, {
            type: 'error',
            timeout: 5000,
          });
        } else {
          nuxtApp.$alert.show(`Something went wrong!`, {
            type: 'error',
            timeout: 5000,
          });
        }
      });
  } catch (error) {
    console.log(error);
    throw error
  }
};

const connectWalletconnectV2 = async () => {
  localStorage.removeItem('account');
  localStorage.removeItem('walletconnect');
  localStorage.setItem('walletType', 'null');
  localStorage.setItem('walletconnect', 'null');
  localStorage.removeItem('wc@2:client:0.3//session');
  localStorage.removeItem('wc@2:universal_provider:/optionalNamespaces');
  localStorage.removeItem('wc@2:core:0.3//pairing');
  localStorage.removeItem('wc@2:core:0.3//expirer');
  localStorage.removeItem('wc@2:core:0.3//history');
  localStorage.removeItem('wc@2:universal_provider:/sessionProperties');
  localStorage.removeItem('wc@2:core:0.3//subscription');
  localStorage.removeItem('wc@2:universal_provider:/namespaces');
  localStorage.removeItem('wc@2:client:0.3//proposal');
  localStorage.removeItem('wc@2:ethereum_provider:/chainId');
  localStorage.removeItem('wc@2:core:0.3//messages');
  localStorage.removeItem('wc@2:core:0.3//keychain');

  const wallet = new WalletConnectorV2();
  const connectedWallet = await wallet.connect();
  const provider = connectedWallet.getProvider();

  const account = connectedWallet.getAccount();

  localStorage.setItem('account', account);
  currentAccount.value = account;

  try {
    const { data } = await axiosService.post(useRuntimeConfig().public.apiBase + `auth/signature`, {
      address: currentAccount.value,
      type: ConnectionType.WALLET_CONNECT,
    });

    signature.value = data;
    const signer = provider.getSigner();
    const signature_new = await signer.signMessage(signature.value.message);
    await login(signature_new, signature.value.session_id);
    emit('close');
  } catch (e) {
    console.log('e', e);
    // nuxtApp.$alert.show(e.response.data.message, {
    //   type: 'error',
    //   timeout: 5000,
    // });
    localStorage.social = '';
    emit('error', true);
  }
};

const login = async (signature, session_id) => {
  axiosService
    .post(useRuntimeConfig().public.apiBase + 'auth/verify-signature', {
      session_id,
      signature: signature,
    })
    .then(async (response) => {
      await userStore.userInfo(response.data.access_token);
      await addressStore.getAddressesAction();

      window.dataLayer.push({
        event: 'talent_new_wallet',
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style lang="scss" scoped>
.social-icon {
  width: 24px;
  height: 24px;
}

.arrow-color {
  filter: invert(77%) sepia(28%) saturate(391%) hue-rotate(204deg) brightness(86%) contrast(83%);
}

.connect-wallet-container {
  
  color: $default;
  h4 {
    font-size: 24px;
    font-weight: 400px;
    line-height: 40px;
    margin-bottom: 24px;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
  }
}

.connect-wallet-modal {
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;

  &_items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &_item {
    background-color: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    gap: 10px;

    color: $default;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;

    &_wrapper {
      display: flex;
      justify-content: flex-start;
      width: 140px;
      gap: 20px;
    }

    p {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
    }
  }

  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    text-align: center;
  }

  &_subtitle {
    color: $section-title;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
}
.wallet-connection {
  overflow: scroll !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 32px;

  .wallet-connection_cheking {
    margin-bottom: 24px;
  }

  &::-webkit-scrollbar {
      width: 6px;
      height: 90%;
  }

  &::-webkit-scrollbar-track {
      border-radius: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
  }

  &::-webkit-scrollbar-thumb {
      background: $secondary;
      border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
      background: $secondary;
  }
}


.failed-connection {
  overflow: scroll !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  width: 100%;

  &_body {
    display: flex;
    height: 136px;
    align-items: center;
    margin-bottom: 24px;

    img {
      width: 80px;
      height: 80px;
      margin-right: 37px;
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 90%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }
}
</style>
