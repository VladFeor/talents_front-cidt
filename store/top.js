import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';

export const useTopStore = defineStore('top', {
  state: () => ({
    topTalents: JSON.parse(localStorage.getItem('topTalents') || '[]'),
    topReviewers: JSON.parse(localStorage.getItem('topReviewers') || '[]'),
  }),
  actions: {
    async getTopTalentsAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'top/talents');

        this.topTalents = data;
        localStorage.topTalents = JSON.stringify(data);
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
    async getTopReviewersAction() {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'top/reviewers',
        );

        this.topReviewers = data;
        localStorage.topReviewers = JSON.stringify(data);
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
  },
  getters: {
    getTopTalents: (state) => state.topTalents,
    getTopReviewers: (state) => state.topReviewers,
  },
});
