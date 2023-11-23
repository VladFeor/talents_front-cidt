import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: JSON.parse(localStorage.getItem('events') || '[]'),
    eventsLoading: false,
  }),
  actions: {
    async getEventsAction() {
      try {
        this.eventsLoading = true;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'events');
        this.events = data;
        localStorage.events = JSON.stringify(data);
        this.eventsLoading = false;
      } catch (error) {
        this.eventsLoading = false;
        console.log('getEventsAction error', error);
      }
    },
    async createEventAction() {
      try {
        const now = new Date();
        const today = Math.floor(Date.now() / 1000);
        const oneDaySeconds = 172800;
        const tomorrow = today + oneDaySeconds;
        const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const unixTimeOneWeekLater = Math.floor(oneWeekLater.getTime() / 1000);
        await AxiosService.post(
          useRuntimeConfig().public.apiBase + 'events',
          {
            title: 'test event',
            description: 'test event description',
            project_id: 186,
            started_at: +tomorrow,
            ended_at: +unixTimeOneWeekLater,
          }
        );

        this.getEventsAction();
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
  },
  getters: {
    getEvents: (state) => state.events,
    getEventsLoading: (state) => state.eventsLoading,
  },
});
