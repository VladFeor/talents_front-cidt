import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from '~/store/user';
import AxiosService from '@/service/axiosService';
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.token || null,
    isRefreshed: false,
  }),
  actions: {
    async login(data) {
      try {
        const response = await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/login', {
          email: data.email,
          password: data.password,
        });
        this.setToken(response.data.access_token);
        useUserStore().userInfo(response.data.access_token);

        window.dataLayer.push({
          event: 'talent_user_login',
        });
      } catch (error) {
        this.setToken(null);
        throw error.response.data;
      }
    },
    async register(data) {
      try {
        const response = await AxiosService.post(
          useRuntimeConfig().public.apiBase + 'auth/register',
          {
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
          },
        );

        window.dataLayer.push({
          event: 'talent_new_user_registration',
        });
      } catch (error) {
        throw error.response.data;
      }
    },
    async resetPassword(data) {
      try {
        await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/refresh-password', {
          email: data.email,
        });
      } catch (error) {
        throw error.response.data;
      }
    },
    setToken(token) {
      this.token = token;
      localStorage.token = token;
    },
    async refreshToken() {
      return new Promise((resolve, reject) => {
        AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/refresh', {})
          .then((response) => {
            this.setToken(response.data.access_token);
            useUserStore().userInfo(response.data.access_token);
            resolve(response);
          })
          .catch((err) => {
            if (err.response.status === 500) {
              useUserStore().setUser(null);
              this.setToken(null);
            }
            localStorage.clear();
            reject();
          });
      });
    },

    async logout() {
      try {
        await AxiosService.post(useRuntimeConfig().public.apiBase + 'auth/logout', {});
        window.dataLayer.push({
          event: 'talent_user_logout',
        });
      } catch (error) {
        console.error('Ошибка выхода из системы', error);
      }
      await localStorage.clear();
      useUserStore().setUser(null);
      this.setToken(null);
      this.refreshToken();
    },
  },
  getters: {
    getToken: (state) => (token) => state.token,
  },
});
