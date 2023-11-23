<template>
  <div class="bio">
    <div class="langs">
      <SelectWithSearch
        :class="{ 'set-up-container': setUpField === 'country' }"
        :options="countries"
        class="select"
        :default="user.country || 'Choose your country'"
        @input="editCountry"
        name="country"
      ></SelectWithSearch>
      <MultiSelectLanguages
        :class="{ 'set-up-container': setUpField === 'languages' }"
        :options="languages"
        :limit="3"
        :initial-selected-items="userLanguages"
        @selected-items="editLanguages"
      ></MultiSelectLanguages>
    </div>
    <div class="editor">
      <BioEditor :content="user.bio" @update="setDescription" />
    </div>
    <div class="socials w-[90%]">
      <SocialTag
        v-for="i in socialButtons"
        :data="i"
        @connect="i.fn()"
        @remove="i.rm()"
        :key="i"
        :hide-remove="i.noRemove"
      ></SocialTag>
    </div>
    <BaseModal :width="480" @close="handleCloseConnectModal($event)" :visible="isShowConnectModal">
      <ConnectWalletModal @close="isShowConnectModal = false" />
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import AxiosService from '~/service/axiosService';
import { useAssetsStore } from '~/store/assets';
import { useUserStore } from '~/store/user';
import axiosService from '~/service/axiosService';
import { ethers } from 'ethers';
import { ConnectionType } from '~/web3/connection';
import { useDebounce } from '~/hooks/useDebounce';
import { shortenAddress } from '@/util/web3';

const assetsStore = useAssetsStore();
const bio = ref('');
const isShowConnectModal = ref(false);
const props = defineProps({
  user: { type: Object, default: () => {} },
});
const setDescription = (event) => {
  bio.value = event;

  if (bio.value.length < 100) {
    nuxtApp.$alert.show('Description is too short. Minimum character count is 100.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  } else if (bio.value.length > 3000) {
    nuxtApp.$alert.show('Description is too long. Maximum character count is 3000.', {
      type: 'error',
      timeout: 5000,
    });
    return;
  }
  AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
    bio: bio.value,
  })
    .then(() => {
      useUserStore().userInfo();

      window.dataLayer.push({
        event: 'talent_profile_update',
      });
    })
    .catch((e) => console.log(e));
};

const nuxtApp = useNuxtApp();

const getSocialName = (social) => {
  return props.user.social_providers.find((i) => i.provider_name === social);
};
const socialButtons = computed(
  () => [
    {
      id: 2,
      icon: getSocialName('google') ? 'Google' : 'Email-Default',
      status: getSocialName('google') || props.user.email,
      name: 'google',
      value: getSocialName('google') ? getSocialName('google').name : props.user.email,
      fn: () => connectSocial('google'),
      rm: () => (getSocialName('google') ? removeSocical('google') : destroyEmail()),
      noRemove: cantDestroy.value,
    },
    {
      id: 3,
      icon: 'Twitter-Default',
      status: getSocialName('twitter'),
      name: 'twitter',
      value: getSocialName('twitter')?.name,
      fn: () => connectSocial('twitter'),
      rm: () => removeSocical('twitter'),
    },
    {
      id: 4,
      icon: 'Discord-Default',
      status: getSocialName('discord'),
      name: 'discord',
      value: getSocialName('discord')?.name,
      fn: () => connectSocial('discord'),
      rm: () => removeSocical('discord'),
    },
    {
      id: 5,
      icon: 'Telegram-Default',
      status: getSocialName('telegram'),
      name: 'telegram',
      value: getSocialName('telegram')?.name,
      fn: () => connectSocial('telegram'),
      rm: () => removeSocical('telegram'),
    },
    {
      id: 7,
      icon: 'Reddit-Default',
      status: getSocialName('reddit'),
      name: 'reddit',
      value: getSocialName('reddit')?.name,
      fn: () => connectSocial('reddit'),
      rm: () => removeSocical('reddit'),
    },
    {
      id: 6,
      icon: 'Wallet-Default',
      status: props.user.wallet,
      name: 'wallet',
      value: props.user.wallet ? shortenAddress(props.user.wallet) : null,
      fn: () => openConnectWalletModal(),
      rm: () => removeWallet(),
      noRemove: true,
    },
  ],
  { dependsOn: [props.user] },
);
const login = async (signature, session_id) => {
  axiosService
    .post(useRuntimeConfig().public.apiBase + 'auth/verify-signature', {
      session_id,
      signature: signature,
    })
    .then(async (response) => {
      await useUserStore().userInfo(response.data.access_token);

      window.dataLayer.push({
        event: 'talent_profile_update',
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
const cantDestroy = computed(() => {
  if (socialButtons.value) {
    return !socialButtons.value.filter((item) => item.status).length > 1;
  } else return true;
});
const currentAccount = ref(null);
const signature = ref(null);

const handleCloseConnectModal = (event) => {
  isShowConnectModal.value = event;
};
async function destroyEmail() {
  AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
    email: null,
  })
    .then(() => {
      useUserStore().userInfo();
      useUserStore().needSetUp('');

      window.dataLayer.push({
        event: 'talent_profile_update',
      });
    })
    .catch((e) => console.log(e));
}
const openConnectWalletModal = () => {
  handleCloseConnectModal(true);
};
async function connectWallet() {
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
        signature.value = response.data;
        const provider = new ethers.providers.Web3Provider(providerMM);
        provider.send('eth_requestAccounts', []);
        const address = await provider.getSigner();
        console.log('address', address);
        console.log('signature connect', signature.value);
        const signature_new = await address.signMessage(signature.value.message);
        login(signature_new, signature.value.session_id);

        window.dataLayer.push({
          event: 'talent_new_wallet',
        });
      })
      .catch((error) => {
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
  }
}

async function removeWallet() {}
async function connectSocial(socialName) {
  if (!getSocialName(socialName)) {
    localStorage.social = socialName;
    AxiosService.get(useRuntimeConfig().public.apiBase + `auth/${socialName}/redirect?uri=/profile`)
      .then((response) => {
        window.location.href = response.data.redirect_url;
        window.dataLayer.push({
          event: 'talent_social_update',
        });
      })
      .catch((e) => console.log(e));
  }
}
async function removeSocical(socialName) {
  if (!socialName) {
    return;
  }
  if (socialButtons.value.filter((i) => !i.status).length !== socialButtons.value.length) {
    AxiosService.delete(useRuntimeConfig().public.apiBase + `auth/${socialName}`)
      .then((response) => {
        useUserStore().userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
      })
      .catch((e) => console.log(e));
  } else {
    nuxtApp.$alert.show(
      'You need to have at least 1 social link. Try to add another and then delete this',
      {
        type: 'error',
        timeout: 2500,
      },
    );
  }
}
async function editLanguages(langs) {
  AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
    language_ids: langs.map((i) => {
      return i.id;
    }),
  })
    .then(() => {
      useUserStore().userInfo();
      useUserStore().needSetUp('');

      window.dataLayer.push({
        event: 'talent_profile_update',
      });
    })
    .catch((e) => console.log(e));
}
const setUpField = computed(() => useUserStore().getSetUpField);
async function editCountry(country) {
  if (country.id) {
    AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
      country_id: country.id,
    })
      .then(() => {
        useUserStore().userInfo();
        useUserStore().needSetUp('');

        window.dataLayer.push({
          event: 'talent_profile_update',
        });
      })
      .catch((e) => console.log(e));
  }
}

const userLanguages = props.user.languages.map((i) => {
  return i.language;
});

const languages = computed(() => assetsStore.getLanguages);
const countries = computed(() => assetsStore.getCountries);
</script>

<style scoped lang="scss">
.bio {
  padding: 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  .langs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .select {
      width: 220px;
    }
  }
  .editor {
    margin-top: 24px;
  }
  .socials {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
