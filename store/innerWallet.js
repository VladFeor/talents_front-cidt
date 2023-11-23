import { defineStore } from 'pinia';
import AxiosService from '~/service/axiosService';

export const useInnerWalletStore = defineStore('innerWallet', {
  state: () => ({
    innerWalletHistory: [],
    projectPayments: [],
    withdrawalRequests: [],
    innerWalletOverview: [],
    innerWalletOverviewLoading: false,
    isInnerWalletOverviewLoaded: false,
  }),
  actions: {
    async getInnerWalletOverviewAction() {
      try {
        this.levelUpRequestsLoading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/inner-wallet/overview`,
        );
        this.innerWalletOverview = data;
        this.innerWalletOverviewLoading = false;
        this.isInnerWalletOverviewLoaded = true;
      } catch (error) {
        this.innerWalletOverviewLoading = false;
        this.isInnerWalletOverviewLoaded = true;
        console.log('getPopularTasksAction error', error);
      }
    },
    async getInnerWalletHistoryAction({ project_id = null, blockchain_id = null, page }) {
      try {
        const params = {};
        if (project_id) {
          params.project_id = project_id;
        }
        if (blockchain_id) {
          params.blockchain_id = blockchain_id;
        }
        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/inner-wallet/history`,
          params,
        );
        this.innerWalletHistory = data;
      } catch (error) {
        console.log('getPopularTasksAction error', error);
      }
    },
    async getProjectPaymentsAction({ project_id = null, blockchain_id = null, page }) {
      try {
        const params = {};
        if (project_id) {
          params.project_id = project_id;
        }
        if (blockchain_id) {
          params.blockchain_id = blockchain_id;
        }
        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/inner-wallet/project-payments`,
          params,
        );
        this.projectPayments = data;
      } catch (error) {
        console.log('getPopularTasksAction error', error);
      }
    },
    async getWithdrawalRequestsAction({ project_id = null, blockchain_id = null, page }) {
      try {
        const params = {};
        if (project_id) {
          params.project_id = project_id;
        }
        if (blockchain_id) {
          params.blockchain_id = blockchain_id;
        }
        if (page) {
          params.page = page;
          params.per_page = 10;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/inner-wallet/withdrawal-requests`,
          params,
        );
        this.withdrawalRequests = data;
      } catch (error) {
        console.log('getPopularTasksAction error', error);
      }
    },
    async claimTokensAction(claimData) {
      try {
        console.log('claimData', claimData);
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `v2/inner-wallet/claim`,
          claimData,
        );
        console.log('claimTokensAction', data);
      } catch (error) {
        console.log('getPopularTasksAction error', error);
        if (error.response.data.errors) {
          const parseErrors = Object.values(error.response.data.errors);
          parseErrors.forEach((errorItem) => {
            throw new Error(errorItem.join('\n'));
          });
        } else {
          throw new Error(error.response.data.message);
        }
      }
    },
    async deleteWithdrawRequestAction(id) {
      try {
        const { data } = await AxiosService.delete(
          useRuntimeConfig().public.apiBase + `v2/inner-wallet/withdrawal-requests/${id}`,
        );
        console.log('deleteWithdrawRequestAction', data);
      } catch (error) {
        console.log('deleteWithdrawRequestAction error', error);
        if (error.response.data.errors) {
          const parseErrors = Object.values(error.response.data.errors);
          parseErrors.forEach((errorItem) => {
            throw new Error(errorItem.join('\n'));
          });
        } else {
          throw new Error(error.response.data.message);
        }
      }
    },
  },
  getters: {
    getProjectPayments: (state) => state.projectPayments,
    getWithdrawalRequests: (state) => state.withdrawalRequests,
    getInnerWalletHistory: (state) => state.innerWalletHistory,
    getInnerWalletOverview: (state) => state.innerWalletOverview,
    getInnerWalletOverviewLoading: (state) => state.innerWalletOverviewLoading,
    getIsInnerWalletOverviewLoaded: (state) => state.isInnerWalletOverviewLoaded,
  },
});
