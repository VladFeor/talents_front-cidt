<template>
  <div class="sidebar flex justify-between flex-col" :class="{ open: isOpen, mobile: isMobile() }">
    <div
      :class="{ open: !isOpen, mobile: isMobile(), scrolled: isScrolled, isSafari: isSafariActive }"
      class="link-list flex justify-between flex-col"
    >
      <div>
        <SidebarLink
          v-for="menuLink in MENU_LINKS"
          :menuLink="menuLink"
          :key="menuLink.name"
          :isOpen="isOpen"
        />
      </div>
      <div
        class="set-up"
        :class="{ hide: !isOpen }"
        v-if="!user.set_up_profile.completed_profile_reward"
      >
        <div class="title">
          Set up your profile <br />
          and get 20 QP
        </div>
        <div class="progress">{{ user.set_up_profile.percentage }}% completed</div>
        <SetProgress :percentage="user.set_up_profile.percentage"></SetProgress>

        <div class="button-group">
          <div v-for="action in actions" @click="action.fn()" class="button">
            {{ action.name }} <Icon :icon="action.icon" :size="16"></Icon>
          </div>
        </div>
      </div>
      <div class="beta" :class="{ scrolledBeta: isScrolled, hide: !isOpen }">
        <span class="msg">
          Welcome to our platform! We are currently in the beta testing phase and would greatly
          appreciate it if you could report any issues were found
        </span>
        <div class="report" @click="goToReportForm()">Leave report</div>
      </div>
    </div>

    <button v-if="!isMobile()" class="sidebar-btn" @click="open">
      <img :class="{ reverse: isOpen }" src="@/assets/icons/Left.svg" alt="" />
    </button>
  </div>
  <BaseModal :width="480" @close="handleCloseConnectModal($event)" :visible="isShowConnectModal">
    <ConnectWalletModal @close="isShowConnectModal = false" />
  </BaseModal>
</template>

<script>
import MENU_LINKS from '@/constants/menuLinks';
import windowSizeMixin from '@/mixins/windowSizeMixin';

export default {
  name: 'Sidebar',
  mixins: [windowSizeMixin],
  props: {
    isOpen: { type: Boolean, default: false },
    open: { type: Function },
  },
  data() {
    return {
      isClicked: false,
      MENU_LINKS,
      isScrolled: false,
      isSafari: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 72) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    },
    changeColor() {
      this.isClicked = !this.isClicked;
    },
  },
};
</script>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '~/store/user';
import AxiosService from '~/service/axiosService';
import axiosService from '~/service/axiosService';
import { ethers } from 'ethers';
import { isSafari } from '~/util/helpers';
const router = useRouter();
const nuxtApp = useNuxtApp();

const userStore = useUserStore();

const isSafariActive = ref(false);
const isShowConnectModal = ref(false);

onMounted(() => {
  const isActive = isSafari();
  if (isActive) {
    isSafariActive.value = true;
  } else {
    isSafariActive.value = false;
  }
});

const user = computed(() => userStore.getUser);
const actions = computed(() =>
  [
    {
      name: 'Connect Twitter',
      icon: 'Twitter-Default',
      status: user.value.set_up_profile.twitter_social_provider,
      fn: () => connectSocial('twitter'),
    },
    {
      name: 'Connect Discord',
      icon: 'Discord-Default',
      status: user.value.set_up_profile.discord_social_provider,
      fn: () => connectSocial('discord'),
    },
    {
      name: 'Connect Telegram',
      icon: 'Telegram-Default',
      status: user.value.set_up_profile.telegram_social_provider,
      fn: () => connectSocial('telegram'),
    },
    {
      name: 'Connect Reddit',
      icon: 'Reddit-Default',
      status: user.value.set_up_profile.reddit_social_provider,
      fn: () => connectSocial('reddit'),
    },
    {
      name: 'Connect Wallet',
      icon: 'Wallet-Default',
      status: user.value.set_up_profile.wallet,
      fn: () => handleCloseConnectModal(true),
    },
    {
      name: 'Add Email',
      icon: 'Google',
      status: user.value.set_up_profile.email,
      fn: () => goTo('email'),
    },
    {
      name: 'Add Language',
      icon: 'Add-Def',
      status: user.value.set_up_profile.languages_count,
      fn: () => goTo('languages'),
    },
    {
      name: 'Add Country',
      icon: 'Add-Def',
      status: user.value.set_up_profile.country,
      fn: () => goTo('country'),
    },
    {
      name: 'Add Directions',
      icon: 'Add-Def',
      status: user.value.set_up_profile.activities_count,
      fn: () => goTo('directions'),
    },
    {
      name: 'Add Skills',
      icon: 'Add-Def',
      status: user.value.set_up_profile.skills_count,
      fn: () => goTo('skills'),
    },
  ].filter((i) => !i.status),
);

async function connectSocial(socialName) {
  localStorage.social = socialName;
  AxiosService.get(useRuntimeConfig().public.apiBase + `auth/${socialName}/redirect?uri=/profile`)
    .then((response) => {
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => console.log(e));
}
async function goTo(field) {
  await userStore.needSetUp(field);
  await router.push('/profile');
}
const currentAccount = ref(null);
const signature = ref(null);

const handleCloseConnectModal = (event) => {
  isShowConnectModal.value = event;
};

const login = async (signature, session_id) => {
  axiosService
    .post(useRuntimeConfig().public.apiBase + 'auth/verify-signature', {
      session_id,
      signature: signature,
    })
    .then(async (response) => {
      await userStore.userInfo(response.data.access_token);
    })
    .catch((error) => {
      console.log(error);
    });
};
function goToReportForm() {
  window.open('https://forms.gle/e43LEzLAooX4mwtc8', '_blank');
  window.dataLayer.push({
    event: 'bug_report',
  });
}
</script>

<style scoped lang="scss">
.sidebar-icon {
  filter: invert(44%) sepia(17%) saturate(642%) hue-rotate(197deg) brightness(95%) contrast(93%);
}
.active-link {
  color: $section-title;
  background: $default-border;
  border-radius: 8px 0px 0px 8px;
  .sidebar-icon {
    filter: none;
  }
}
.change-color {
  stroke: red;
}
.link-list {
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  color: $secondary;
  height: 100%;
  transition: transform 0.5s ease-in-out;

  &.isSafari {
    // overflow: inherit;
    li {
      margin: 0;
      padding: 0;
    }
  }
  // li {
  //   max-height: 48px;
  // }
  &.scrolled {
    transform: translateY(-100px);
  }
  .link-name {
    transition: opacity 0.5s ease-in-out;
    opacity: 1;
    width: 1px;
  }
  &.open {
    .link-name {
      opacity: 0;
      width: 1px;
      cursor: none;
      pointer-events: none;
    }
  }
}
.link-item {
  padding: 12px 14px;
  display: flex;
  width: 100%;
  gap: 10px;
}

.sidebar {
  position: fixed;
  top: 0;
  padding: 105px 0 10px 0;
  // position: relative;
  width: 100%;
  max-width: 72px;
  background-color: $default-bg;
  height: 100vh;
  z-index: 100;
  transition: max-width 0.5s ease-in-out;
  will-change: max-width;
  border-right: 1px solid $default-border;
  color: black;
  // padding: 75px 0;
  &.mobile {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 0px;
    opacity: 0;
  }
}

.sidebar.open {
  max-width: 200px;
  opacity: 1;
}

.sidebar-btn {
  position: absolute;
  // top: 410px;
  bottom: 100px;
  right: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background-color: $default-bg;
  border: 1px solid $default-border;
  &:hover {
    background-color: #dad9f7;
  }
}
.reverse {
  transform: rotate(180deg);
}

.set-up {
  margin: 10px 0;
  margin-left: 8px;
  display: flex;
  width: 168px;
  padding: 10px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #ffb580;
  background: $white;
  .title {
    color: $orange;
    font-family: 'Basis Grotesque Pro';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
  .progress {
    color: $secondary;
    font-family: 'Basis Grotesque Pro';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.168px;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    .button {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 3px 8px;
      align-items: center;
      border-radius: 6px;
      border: 1px solid $default-badge-border;
      background: $default-bg;
      color: $default;
      font-family: 'Basis Grotesque Pro';
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.168px;
    }
  }
}

.beta {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  margin-left: -8px;
  margin-top: -8px;
  transition-duration: 0.5s;
  width: 200px;
  .msg {
    color: $secondary;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.154px;
  }
  .report {
    width: 100%;
    border-radius: 6px;
    background: linear-gradient(45deg, $not-active-border 0%, rgba(137, 147, 181, 0) 100%),
      rgba(170, 167, 204, 0.45);
    color: $white;
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums slashed-zero;
    font-family: 'Basis Grotesque Pro';
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 145.455% */
    letter-spacing: 0.154px;
    cursor: pointer;
  }
}

@media all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
  .scrolledBeta {
    top: -20%;
    transition-duration: 0.5s;
  }
}

/* Стиль для Firefox */
@-moz-document url-prefix() {
  .scrolledBeta {
    top: 0;
    transition-duration: 0.5s;
  }
}

.hide {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}
</style>
