import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService'
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboard: JSON.parse(localStorage.getItem('dashboard') || '[]'),
    dashboardOverview: JSON.parse(localStorage.getItem('dashboardOverview') || '[]'),
    dashboardOverviewLoading: false,
    statisticChart: JSON.parse(localStorage.getItem('statisticChart') || '[]'),
    statisticChartLoading: false,
    availableTasks: JSON.parse(localStorage.getItem('availableTasks') || '[]'),
    availableTasksLoading: false,
    leaderBoard: [],
    leaderBoardLoading: false,
  }),
  actions: {
    async getDashboardAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBaseV2 + 'dashboard');

        this.dashboard = data;
        localStorage.dashboard = JSON.stringify(data);
      } catch (error) {
        console.log('getEventsAction error', error);
      }
    },
    async getDashboardOverviewAction() {
      try {
        this.dashboardOverviewLoading = true;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'dashboard/overview');
        this.dashboardOverview = data;
        localStorage.dashboardOverview = JSON.stringify(data);
        this.dashboardOverviewLoading = false;
      } catch (error) {
        this.dashboardOverviewLoading = false;
        console.log('getEventsAction error', error);
      }
    },
    async getStatisticChartAction(type, period) {
      try {
        this.statisticChartLoading = true;
        const { data } = await AxiosService.get(
          `${useRuntimeConfig().public.apiBase}statistics?type=${
            type || 'completed_tasks'
          }&period=${period || 'y'}`
        );
        this.statisticChart = data;
        localStorage.projectChart = JSON.stringify(data);
        this.statisticChartLoading = false;
      } catch (error) {
        this.statisticChartLoading = false;
        console.log('getEventsAction error', error);
      }
    },
    async getAvailableTasksAction() {
      try {
        this.availableTasksLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'dashboard/newest-tasks'
        );
        this.availableTasks = data;
        localStorage.availableTasks = JSON.stringify(data);
        this.availableTasksLoading = false;
      } catch (error) {
        this.availableTasksLoading = false;
        console.log('getAvailableTasksAction error', error);
      }
    },
    async getLeaderBoardAction() {
      try {
        this.leaderBoardLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + 'dashboard/leaderboard'
        );
        this.leaderBoard = data;
        this.leaderBoardLoading = false;
      } catch (error) {
        this.leaderBoardLoading = false;
        console.log('getLeaderBoardAction error', error);
      }
    },
  },
  getters: {
    getDashboard: (state) => state.dashboard,
    getAvailableTasks: (state) => state.availableTasks,
    getAvailableTasksLoading: (state) => state.availableTasksLoading,
    getDashboardOverview: (state) => state.dashboardOverview,
    getDashboardOverviewLoading: (state) => state.dashboardOverviewLoading,
    getStatisticChart: (state) => state.statisticChart,
    getStatisticChartLoading: (state) => state.statisticChartLoading,
    getLeaderBoard: (state) => state.leaderBoard,
    getLeaderBoardLoading: (state) => state.leaderBoardLoading,
  },
});
