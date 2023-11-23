import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [],
  }),
  actions: {
    async getAddressesAction() {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/wallet-addresses`,
        );
        console.log('getAddressesAction data', data);
        this.addresses = data;
        return data;
      } catch (error) {
        console.log('getAddressesAction error', error);
      }
    },
    async deleteAddressesAction(id) {
      try {
        const { data } = await AxiosService.delete(
          useRuntimeConfig().public.apiBase + `v2/wallet-addresses/${id}`,
        );
        console.log('deleteAddressesAction data', data);
        return data;
      } catch (error) {
        console.log('deleteAddressesAction error', error);
      }
    },
    async setPrimaryAddressAction(address) {
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `v2/wallet-addresses/primary/${address}`,
        );
        console.log('setAddressAction data', data);
      } catch (error) {
        console.log('setAddressAction error', error);
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
    async setOrderAddressesAction(rows) {
      console.log('setOrderAddressesAction rows', rows);
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `v2/wallet-addresses/reorder`,
          {
            rows,
          },
        );
        console.log('setOrderAddressesAction data', data);
      } catch (error) {
        console.log('setOrderAddressesAction error', error);
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
    async setAddressAction(walletsData) {
      try {
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `v2/wallet-addresses`,
          walletsData,
        );
        console.log('setAddressAction data', data);
      } catch (error) {
        console.log('setAddressAction error', error);
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
    getAddresses: (state) => state.addresses,
  },
});
