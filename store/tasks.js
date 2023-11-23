import { defineStore } from 'pinia';
import AxiosService from '@/service/axiosService';
export const useTasksStore = defineStore('tasks', {
  state: () => ({
    popularTasks: [],
    popularTasksLoading: false,
    isPopularTasksLoaded: false,
    tasks: null,
    tasksLoading: false,
    tasksLoaded: false,
    reviews: null,
    reviewsLoading: false,
    reviewsLoaded: false,
    task: null,
    taskLoading: false,
    taskLoaded: false,
    userTask: null,
    userTaskLoading: false,
    userTaskLoaded: false,
    claimStatus: false,
  }),
  actions: {
    async getTaskAction(id) {
      try {
        this.taskLoading = true;

        const { data } = await AxiosService.get(useRuntimeConfig().public.apiBase + `tasks/${id}`);

        this.task = data;
        this.taskLoading = false;
        this.taskLoaded = true;
        return data;
      } catch (error) {
        this.taskLoading = false;
        this.taskLoaded = true;
        console.log('getTasksAction error', error);
        throw error;
      }
    },
    async getUserTaskAction(id) {
      try {
        this.userTaskLoading = true;

        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/user-tasks/${id}`,
        );

        this.userTask = data;
        this.userTaskLoading = false;
        this.userTaskLoaded = true;
      } catch (error) {
        this.userTaskLoading = false;
        this.userTaskLoaded = true;
        console.log('getUserTaskAction error', error);
        throw error;
      }
    },
    async updateUserTaskAction(id) {
      try {
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/user-tasks/${id}`,
        );

        this.userTask = data;
      } catch (error) {
        console.log('updateUserTaskAction error', error);
        throw error;
      }
    },
    async setUserTaskVerificationAction(id, type, extraParameter) {
      try {
        const paramsData = {};
        this.claimStatus = false;
        paramsData.type = type;
        if (extraParameter) {
          paramsData.own_post_url = extraParameter;
        }
        const { data } = await AxiosService.post(
          useRuntimeConfig().public.apiBase + `v2/user-tasks/verify/${id}`,
          paramsData,
          // { type },
        );
        this.claimStatus = data.can_be_claimed;
        console.log('setUserTaskVerificationAction', data);
        return data;
      } catch (error) {
        console.log('setUserTaskVerificationAction error', error);
      }
    },
    async getReviewsAction(_data) {
      try {
        this.reviewsLoading = true;
        const params = {};
        params.order_by_deadline = 'desc';
        params.per_page = 9;
        if (_data) {
          const { status, page, project_id, sortKey, sortType, types } = _data;
          if (status) {
            params.status = status;
          }
          if (project_id) {
            params.project_id = project_id;
          }
          if (page) {
            params.page = page;
            params.per_page = 9;
          }
          if (types) {
            params.types = types;
          }
          if (sortKey) {
            params['sort[key]'] = sortKey;
          }
          if (sortType) {
            params['sort[type]'] = sortType;
          }
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `user-tasks`,
          params,
        );

        this.reviews = data;
        this.reviewsLoading = false;
        this.reviewsLoaded = true;
      } catch (error) {
        this.reviewsLoading = false;
        this.reviewsLoaded = true;
        console.log('getTasksAction error', error);
      }
    },
    setTasks(data) {
      this.tasks = data;
    },
    destroyTask() {
      this.userTask = null;
      this.userTaskLoading = true;
      this.userTaskLoaded = false;
      this.claimStatus = null;
    },
    setReviews(data) {
      this.reviews = data;
    },
    async getTasksAction({
      search,
      status,
      page,
      reward_type,
      project_id,
      activity_id,
      types,
      priority,
      sortKey,
      sortType,
    }) {
      try {
        this.tasksLoading = true;
        const params = {};
        if (types) {
          if (types === 'on') {
            params.type = 'on-chain';
          }
          if (types === 'of') {
            params.type = 'regular';
          }
        }
        if (search) {
          params.search = search;
        }
        if (status) {
          params.status = status;
        }
        if (reward_type) {
          params.reward_type = reward_type;
        }
        if (project_id) {
          params.project_id = project_id;
        }
        if (priority) {
          params.priority = priority;
        }
        if (activity_id) {
          params.activity_id = activity_id;
        }

        if (page) {
          params.page = page;
          params.per_page = 9;
        }
        console.log('sortKey', sortKey);
        if (sortKey) {
          params['sort[key]'] = sortKey;
        }
        console.log('sortType', sortType);
        if (sortType) {
          params['sort[type]'] = sortType;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `v2/tasks`,
          params,
        );

        this.tasks = data;
        this.tasksLoading = false;
        this.tasksLoaded = true;
      } catch (error) {
        this.tasksLoading = false;
        this.tasksLoaded = true;
        console.log('getTasksAction error', error);
      }
    },
    async getPopularTasksAction(id) {
      try {
        this.popularTasksLoading = true;
        const params = {};
        if (id) {
          params.project_id = id;
        }
        const { data } = await AxiosService.get(
          useRuntimeConfig().public.apiBase + `tasks/popular`,
          params,
        );

        this.popularTasks = data;
        this.popularTasksLoading = false;
        this.isPopularTasksLoaded = true;
      } catch (error) {
        this.popularTasksLoading = false;
        this.isPopularTasksLoaded = true;
        console.log('getPopularTasksAction error', error);
      }
    },
  },
  getters: {
    getPopularTasks: (state) => state.popularTasks,
    getPopularTasksLoading: (state) => state.popularTasksLoading,
    getIsPopularTasksLoaded: (state) => state.isPopularTasksLoaded,
    getTasks: (state) => state.tasks,
    getTasksLoading: (state) => state.tasksLoading,
    getTasksLoaded: (state) => state.tasksLoaded,
    getReviews: (state) => state.reviews,
    getReviewsLoading: (state) => state.reviewsLoading,
    getReviewsLoaded: (state) => state.reviewsLoaded,
    getTask: (state) => state.task,
    getTaskLoading: (state) => state.taskLoading,
    getTaskLoaded: (state) => state.taskLoaded,
    getUserTask: (state) => state.userTask,
    getUserTaskLoading: (state) => state.userTaskLoading,
    getUserTaskLoaded: (state) => state.userTaskLoaded,
    getClaimStatus: (state) => state.claimStatus,
  },
});
