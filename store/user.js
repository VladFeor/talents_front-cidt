import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';
export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('user'),
    balance: '',
    rewards: [],
    notifications: [],
    allNotifications: [],
    QR: null,
    setupProfile: '',
  }),

  actions: {
    async userInfo(token) {
      try {
        const response = await AxiosService.get(useRuntimeConfig().public.apiBase + 'auth/me');
        if (response) {
          this.setUser(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async needSetUp(field) {
      this.setupProfile = field;
    },
    async getQRAction() {
      try {
        const QR = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + 'profile/2fa');
        this.QR = QR.data;
      } catch (err) {
        console.error(err);
      }
    },
    async getRewardsAction() {
      try {
        const response = await AxiosService.get(
          useRuntimeConfig().public.apiBaseV2 + 'profile/discord-rewards',
        );
        if (response) {
          this.rewards = response.data;
        }
      } catch (err) {
        console.error(err);
      }
    },

    setUser(user) {
      this.user = user;
      this.isAuthenticated = user !== null;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
  },
  getters: {
    getUser: (state) => state.user,
    getWallet: (state) => state.user.wallet,
    getRewards: (state) => state.rewards,
    getQR: (state) => state.QR,
    getSetUpField: (state) => state.setupProfile,
  },
});
