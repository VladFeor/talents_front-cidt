import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';

export const useDiscordStore = defineStore('discord', {
  state: () => ({}),
  actions: {
    async getDiscordRoleAction(id) {
      try {
        // this.eventsLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/${id}/discord/guild/roles`
        );
        console.log('discord data', data);
        return data;
        // this.events = data;
        // localStorage.events = JSON.stringify(data);
        // this.eventsLoading = false;
      } catch (error) {
        // this.eventsLoading = false;
        console.log('getEventsAction error', error);
      }
    },
  },
  getters: {},
});
