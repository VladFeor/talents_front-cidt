import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useLeaderBoardStore = defineStore('leaderboard', {
  state: () => ({
    leaderboard: [],
    isLeaderBoardLoaded: false,
  }),
  actions: {
    async getLeaderBoardAction(page, filters, status) {
      this.isLeaderBoardLoaded = false;
      const url = !status ? 'leaderboard' : 'leaderboard/joined-projects';
      try {
        const { data } = await AxiosService.post(useRuntimeConfig().public.apiBaseV2 + url, {
          page: page,
          ...filters,
        });
        this.leaderboard = data;
        this.isLeaderBoardLoaded = true;
      } catch (error) {
        console.log('getLeaderBoardAction error', error);
      }
    },
  },
  getters: {
    getLeaderBoard: (state) => state.leaderboard,
    getLeaderBoardLoaded: (state) => state.isLeaderBoardLoaded,
  },
});
