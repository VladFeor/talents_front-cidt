<template>
  <div class="main-wrapper" v-if="!loading && isDesktop">
    <Header :open="toggleSidebar" />
    <div class="main-content" :class="{ open: sidebarOpen, mobile: isMobile() }">
      <Sidebar :open="toggleSidebar" :isOpen="sidebarOpen" />
      <div class="children-content" :class="{ open: sidebarOpen }">
        <!-- <DashboardSkeleton v-if="loading"></DashboardSkeleton> -->
        <slot />
      </div>
    </div>
    <div class="footer_wrapper">
      <Footer />
    </div>
  </div>
  <ScreenStub v-if="!loading && !isDesktop"></ScreenStub>
</template>
<script setup>
import ScreenStub from '~/components/ScreenStub.vue';
document.title = 'Talentum Talents';

const isDesktop = computed(
  () => window.innerWidth > 1330 || (localStorage.scale != 'false' && localStorage.scale),
);
useHead(() => ({
  meta: [
    {
      name: 'viewport',
      content:
        isDesktop.value && window.innerWidth > 1330
          ? 'initial-scale=1, maximum-scale=1'
          : `initial-scale=${localStorage.scale || 1}, initial-scale=1, maximum-scale=${
              localStorage.scale || 1
            }`,
    },
  ],
}));
</script>
<script>
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { useAuthStore, useNotificationsStore, useUserStore } from '../store';
import { useTokenLifetime } from '~/hooks/token';
import { useNotificationTrigger } from '~/hooks/notifications';
useTokenLifetime();
useNotificationTrigger();
export default {
  mixins: [windowSizeMixin],
  data() {
    return {
      sidebarOpen: true,
      loading: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
  created() {
    useTokenLifetime();
    useUserStore()
      .userInfo(useAuthStore().token)
      .then(() => {
        useNotificationsStore().getNotificationsAction();
        this.loading = false;
      });
  },
};
</script>

<style scope lang="scss">
.footer_wrapper {
  margin-top: auto;
  position: relative;
  // z-index: 205;
}
.main-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 30;
  height: 100%;
  background-color: $default-bg;
  min-height: 100vh;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
}

.children-content {
  padding: 40px 40px 0px 120px;
  //min-height: calc(100vh - 144px);
  min-height: 100vh;
  transition: padding-left 0.5s ease-in-out;
  &.open {
    padding-left: 240px;
  }
}

.main-content {
  width: 100%;
  height: 100%;
  position: relative;
  // z-index: 1;
  transition: grid-template-columns 0.5s ease-in-out;
}

.main-content.open {
  grid-template-columns: 200px 1fr;
}

.main-content.mobile {
  grid-template-columns: 1fr;
}
</style>
