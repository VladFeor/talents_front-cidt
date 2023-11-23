import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    reportTypes: [],
    tags: [],
    project: null,
    projects: [],
    projectsTop3: [],
    mediumPosts: [],
    total: 0,
    totalPages: 0,
    loading: false,
    joinedLoading: false,
    refCode: null,
    verifiedProjects: [],
    verifiedTasks: []
  }),
  actions: {
    async getProjectsAction(onlyJoined = false) {
      try {
        this.loading = true;
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `projects`, {
          onlyJoined,
        });
        this.projects = data;
        this.loading = false;
      } catch (error) {
        console.log('getProjectsAction error', error);
      }
    },
    async getProjectCode(id) {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `invitations/generate/${id}`,
        );
        this.refCode = data.token;
      } catch (error) {
        console.log('getProjectCode error', error);
      }
    },
    async getProjectsListAction(params) {
      try {
        this.loading = true;
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/list`,
          params,
        );
        this.project = null;
        this.projects = data;
        if (!params.joined && data.data.length) {
          this.projectsTop3 = data.data
            .sort((a, b) => b.members_count - a.members_count)
            .slice(0, data.data.length < 3 ? data.data.length : 3);
        }
        this.total = data.pagination.total;
        this.totalPages = data.pagination.total_pages;
        this.loading = false;
      } catch (error) {
        console.log('getProjectsAction error', error);
      }
    },
    async getTagsAction() {
      try {
        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `tags`);
        this.tags = data;
      } catch (error) {
        console.log('getTagsAction error', error);
      }
    },
    async getReportTypesAction() {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `projects/reportTypes`,
        );
        this.reportTypes = data;
      } catch (error) {
        console.log('getTagsAction error', error);
      }
    },
    async getProjectAction(id) {
      try {
        const { data } = await AxiosService.get(
          `${useRuntimeConfig().public.apiBase}projects/${id}?all=true`,
        );
        this.project = data;
      } catch (error) {
        console.log('getTagsAction error', error);
        throw error;
      }
    },
    async joinProjectAction({ id, referral_code }) {
      try {
        const params = {};
        if (referral_code) {
          params.referral_code = referral_code;
        }
        this.joinedLoading = true;
        const { data } = await AxiosService.post(
          `${useRuntimeConfig().public.apiBase}user-projects/${id}?all=true`,
          params,
        );
        this.joinedLoading = false;
      } catch (error) {
        this.joinedLoading = false;
        throw error;
        console.log('getTagsAction error', error);
      }
    },
    async leaveProjectAction(id) {
      try {
        this.joinedLoading = true;
        const { data } = await AxiosService.delete(
          `${useRuntimeConfig().public.apiBase}user-projects/${id}?all=true`,
        );
        this.joinedLoading = false;
      } catch (error) {
        this.joinedLoading = false;
        return error;
      }
    },
    async reportProjectAction(params) {
      try {
        const { data } = await AxiosService.post(
          `${useRuntimeConfig().public.apiBase}projects/${params.id}/report`,
          params,
        );
      } catch (error) {
        return error;
      }
    },
    async getProjectMediumPostsAction(params) {
      try {
        const req = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${params.medium_username}`,
        );
        const { items } = await req.json();
        this.mediumPosts = items;
      } catch (error) {
        console.log('getTagsAction error', error);
      }
    }
  },
  getters: {
    getJoinedLoading: (state) => state.joinedLoading,
    getTags: (state) => state.tags,
    getReportTypes: (state) => state.reportTypes,
    getProjects: (state) => state.projects,
    getProjectsTop3: (state) => state.projectsTop3,
    getProject: (state) => state.project,
    getProjectMediumPosts: (state) => state.mediumPosts,
    getTotal: (state) => state.total,
    getTotalPages: (state) => state.totalPages,
    getLoading: (state) => state.loading,
    getCode: (state) => state.refCode,
    getProjectVerification: (state) => state.verifiedProjects,
  },
});
