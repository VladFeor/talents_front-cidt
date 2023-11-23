import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';

export const useAssetsStore = defineStore('assets', {
  state: () => ({
    languages: [],
    countries: [],
    activities: [],
    skills: [],
    socialLinks: [],
  }),
  actions: {
    async getLanguagesAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `languages`);
        this.languages = data;
      } catch (error) {
        console.log('getLanguagesAction error', error);
      }
    },
    async getCountriesAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `countries`);
        this.countries = data;
      } catch (error) {
        console.log('getCountriesAction error', error);
      }
    },
    async getActivitiesAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'activities');
        this.activities = data;
      } catch (error) {
        console.log('getActivitiesAction error', error);
      }
    },
    async getSocialsLinksAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'social-links?assigned_to=ambassador');
        this.socialLinks = data;
      } catch (error) {
        console.log('getSocialsLinksAction error', error);
      }
    },
    async getSkillsAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + 'skills');
        this.skills = data;
      } catch (error) {
        console.log('getSkillsAction error', error);
      }
    },
  },
  getters: {
    getLanguages: (state) => state.languages,
    getCountries: (state) => state.countries,
    getSkills: (state) => state.skills,
    getActivities: (state) => state.activities,
    getSocialLinks: (state) => state.socialLinks,
  },
});
