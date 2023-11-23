<template>
  <div class="profile">
    <BannerUploader :banner="user.banner"></BannerUploader>
    <div class="naming w-full">
      <AvatarUploader :avatar="user.avatar"></AvatarUploader>
      <div class="info">
        <InputName v-model="name" :placeholder="user.name" @input="setName"></InputName>
        <SecurityButton></SecurityButton>
      </div>
    </div>
    <div class="info-block">
      <div class="content">
        <Bio :user="user"></Bio>
        <Directions :user="user"></Directions>
        <DeleteProfile :data="userLevel"></DeleteProfile>
      </div>
      <div class="sidebar">
        <LevelCard :data="userLevel"></LevelCard>
        <CurrentBalance></CurrentBalance>
        <WalletAddresses />
        <NFTRewards></NFTRewards>
        <RoleReward></RoleReward>
      </div>
    </div>
  </div>
  <TelegramError @close="showModalError = false" v-if="showModalError"></TelegramError>
</template>
<script setup>
import { useUserStore } from '~/store/user';
import { useAssetsStore } from '~/store/assets';
import { useDashboardStore } from '~/store/dashboard';
import AxiosService from '~/service/axiosService';

import { computed, onMounted } from 'vue';
import axios from 'axios';
import TelegramError from '~/components/Profile/TelegramError.vue';
const userStore = useUserStore();
const assetsStore = useAssetsStore();
const user = computed(() => userStore.getUser);
const userStat = computed(() => dashboardStore.getDashboardOverview);
const dashboardStore = useDashboardStore();
let name = ref(user.value.name);
const route = useRoute();
const nuxtApp = useNuxtApp();
const router = useRouter();
const showModalError = ref(false);
const tgAccessTime = ref('');
onMounted(() => {
  dashboardStore.getDashboardOverviewAction();
  assetsStore.getLanguagesAction();
  assetsStore.getCountriesAction();
  assetsStore.getActivitiesAction();
  assetsStore.getSocialsLinksAction();
  assetsStore.getSkillsAction();
  userStore.getQRAction();
  userStore.userInfo();
  const isTG = window.location.href.match(/[#\?\&]tgAuthResult=([A-Za-z0-9\-_=]*)$/);
  if (localStorage.social && route.query && !isTG) {
    const query = Object.entries(route.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    AxiosService.get(
      useRuntimeConfig().public.apiBase + `auth/${localStorage.social}/callback/?${query}`,
    )
      .then(async () => {
        await userStore.userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
        await router.push('/profile');
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      })
      .finally(() => {
        localStorage.social = '';
      });
  } else if (localStorage.social && isTG) {
    AxiosService.get(
      useRuntimeConfig().public.apiBase +
        `auth/${localStorage.social}/callback/?tgAuthResult=${isTG[1]}`,
    )
      .then(async () => {
        await userStore.userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
        await router.push('/profile');
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';

        if (e.response.data && !e.response.data.connectionStatus) {
          showModalError.value = true;
          tgAccessTime.value = e.response.data.connection_available_at;
        }
      })
      .finally(() => {
        localStorage.social = '';
      });
  }
});
const userLevel = computed(() => {
  if (Object.keys(userStat.value).length) {
    console.log('userStat.value', userStat.value);
    return {
      level: userStat.value.level_data.level,
      totalPoints: userStat.value.level_data.points,
      nextLevel: userStat.value.level_data.next_level,
      total: userStat.value.level_data.need_points,
      progress: userStat.value.level_data.points,
    };
  } else return null;
});
let timeOut = ref(null);
const setName = () => {
  clearTimeout(timeOut.value);
  timeOut.value = setTimeout(() => {
    AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
      name: name.value,
    })
      .then(() => {
        useUserStore().userInfo();

        window.dataLayer.push({
          event: 'talent_profile_update',
        });
      })
      .catch((e) => console.log(e));
  }, 500);
};
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  .naming {
    margin-top: 140px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .info {
      margin-left: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-bottom: 80px;
    gap: 40px;
    .sidebar {
      width: 360px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
    }
    .content {
      display: flex;
      flex-direction: column;
      min-width: 760px;
      width: 100%;
      gap: 24px;
    }
  }
}
</style>
