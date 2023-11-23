<template>
  <div class="projects-page flex justify-center">
    <div class="max-w-[1160px] w-full">
      <div class="flex justify-between items-center">
        <div class="flex">
          <h1 class="text-[56px] leading-[72px] font-semithin cursor-pointer hover:text-[#1A1D29]"
            :style="{ color: joinedProjects ? '#aaa7cc' : '#1A1D29' }" @click="setProjectType(0)">
            Projects
          </h1>
          <h1 class="text-[56px] leading-[72px] font-semithin ml-10 cursor-pointer hover:text-[#1A1D29]"
            :style="{ color: joinedProjects ? '#1A1D29' : '#aaa7cc' }" @click="setProjectType(1)">
            Joined Projects
          </h1>
        </div>
        <div class="flex items-center justify-center">
          <div class="relative">
            <input type="text" placeholder="Find a project..."
              class="bg-white h-10 w-[240px] px-[14px] py-[7px] rounded-lg border border-[#DAD9F7] text-base pl-10 outline-none"
              v-model="searchString" @input="searchProject" />
            <Icon name="Search" :size="20" class="absolute left-3 top-3" />
          </div>
        </div>
      </div>
      <div class="mt-12 rounded-[16px] h-[320px]" v-if="projectsTop3 && projectsTop3.length > 0">
        <FirstProject :project="firstProject" @prevRow="prevRow" @nextRow="nextRow" />
      </div>
      <div class="mt-12 flex justify-between h-[32px]">
        <div class="flex justify-start">
          <template v-if="!joinedProjects">
            <Select v-if="blockchainsLoaded && blockChainOptions" class="w-[165px]" :height="380"
              :options="blockChainOptions" :scrollHorizontalHidden="true" @input="setBlockChain" />
            <Multi label="Categories" class="ml-2 w-[200px]" :height="380" :options="categoriesOptions"
              :scrollHorizontalHidden="true" :show-label-and-lenght="true" @update:modelValue="setCategory" />
          </template>
        </div>
        <div class="flex justify-start">
          <Select class="w-[165px]" :height="380" :options="sortingOptions" :scrollHorizontalHidden="true"
            @input="setSortingOptions" />
        </div>
      </div>
      <div class="mt-7">
        <p class="font-normal text-xl leading-[32px] text-[#38405B] h-8">{{ total }} projects</p>
      </div>
      <div class="mt-7 pb-7 flex flex-wrap justify-start">
        <!-- <ProjectCardsSkeleton v-if="loading" /> -->
        <div v-if="loading" class="projects-sleletons_wrapper">
          <ProjectCardSkeletonNew v-for="i in 16" :key="i" />
        </div>
        <template v-if="allProjects && !loading">
          <ProjectCardItem v-for="(project, i) in allProjects" :project="project" :first-project="firstProject"
            @connect-wallet="(value) => isShowConnectModal = value" />
        </template>
        <template v-if="allProjects && allProjects.length <= 0 && !loading">
          <EmptyList title="There are no projects yet" />
        </template>
      </div>
      <!-- Here will be skeleton -->
      <div class="mt-7 pb-7 h-[200px]" v-if="loading" />
      <Pagination v-if="!loading" @pageChanged="nextPage($event)" :currentPage="currentPage" :totalPages="totalPages" />
    </div>
    <!-- <BaseModal :width="480" @close="isShowConnectModal = false" :visible="isShowConnectModal" :isScrollOff="true">
      <ConnectWalletModal @close="toggleWalletConnecting" @connect-wallet="(value) => isShowConnectModal = value"/>
    </BaseModal> -->
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useBlockchainsStore } from '@/store/blockchains';
import { useProjectsStore, useUserStore } from '@/store';
import { EmptyList, ProjectCardItem, ProjectCardsSkeleton, FirstProject } from '~/components/';
let isMounted = false;
const projectsStore = useProjectsStore();
const blockchainsStore = useBlockchainsStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  blockchainsStore.getBlockchainsAction();
  projectsStore.getTagsAction();

  if (route.query && route.query.status) {
    joinedProjects.value = true;
    projectsStore.getProjectsListAction({
      page: currentPage.value,
      joined: joinedProjects.value,
    });
  } else {
    projectsStore.getProjectsListAction({
      page: currentPage.value,
    });
  }
  if (route.query && route.query.table) {
    setProjectType(+route.query.table);
  }
  isMounted = true;
});

const categories = ref([]);
const blockChainId = ref(0);
const currentPage = ref(route.query ? route.query.page : 1);
const sorting = ref(null);
const searchTimeout = ref(null);
const searchString = ref(null);
const joinedProjects = ref(0);
const firstProjectIndex = ref(0);
const isShowConnectModal = ref(false);
const totalPages = computed(() => projectsStore.getTotalPages);
const loading = computed(() => projectsStore.getLoading);
const allTagsData = computed(() => projectsStore.getTags);
const total = computed(() => projectsStore.getTotal);
const allTags = computed(() => allTagsData.value);
const allProjectsData = computed(() => projectsStore.getProjects.data);
const allProjects = computed(() => allProjectsData.value);
const projectsTop3 = computed(() => projectsStore.getProjectsTop3);
const firstProject = computed(() => {
  if (projectsTop3.value) {
    return projectsTop3.value[firstProjectIndex.value];
  } else {
    return null;
  }
});
const sortingOptions = computed(() => [
  { id: 0, key: 'name', type: 'asc', name: 'Alphabet A to Z' },
  { id: 1, key: 'name', type: 'desc', name: 'Alphabet Z to A' },
  { id: 2, key: 'members_count', type: 'desc', name: 'Most popular first' },
  { id: 3, key: 'id', type: 'desc', name: 'Newest First' },
  { id: 4, key: 'id', type: 'asc', name: 'Oldest First' },
]);
const blockChainOptions = computed(() => [
  { id: 0, name: 'All Blockchains' },
  ...blockchainsStore.getBlockchains,
]);
const blockchainsLoaded = computed(() => blockchainsStore.blockchainsLoaded);
const categoriesOptions = computed(() => [{ name: 'Any Categories' }, ...allTags.value]);
function setBlockChain(blockChain) {
  if (!isMounted) return;
  blockChainId.value = blockChain.id;
  getProjectsByParams();
}

function setCategory(category) {
  categories.value = category[0] === 'Any Categories' ? null : category;
  getProjectsByParams();
}

function setSortingOptions(option) {
  if (!isMounted) return;
  sorting.value = option;
  getProjectsByParams();
}

function searchProject() {
  clearTimeout(searchTimeout.value);
  currentPage.value = 1;
  searchTimeout.value = setTimeout(() => getProjectsByParams(), 1500);
}

function nextPage(page) {
  currentPage.value = page;
  getProjectsByParams();
}

function getProjectsByParams() {
  projectsStore.getProjectsListAction({
    sorting: sorting.value,
    joined: joinedProjects.value,
    search: searchString.value || null,
    tags: categories.value,
    blockchain_id: blockChainId.value,
    page: currentPage.value,
  });
}

function prevRow() {
  if (firstProjectIndex.value <= 0) return;
  firstProjectIndex.value = firstProjectIndex.value - 1;
}

function nextRow() {
  if (firstProjectIndex.value + 1 === projectsTop3.value.length) return;
  firstProjectIndex.value = firstProjectIndex.value + 1;
}

function setProjectType(type) {
  joinedProjects.value = type;
  currentPage.value = 1;
  router.push(`projects?table=${joinedProjects.value}`);
  getProjectsByParams();
}

function toggleWalletConnecting() {
  isShowConnectModal.value = !isShowConnectModal.value;
}

function handleWalletConnectionError() {
  toggleWalletConnecting()
  isConnectingError.value = !isConnectingError.value;
}

function closeAllWalletModals() {
  isShowConnectModal.value = false;
  isShowConnectionModal.value = false;
  isConnectingError.value = false;
}

watch(
  () => route.query.table,
  (value) => {
    if (route.name === 'projects') setProjectType(+value);
  },
);

</script>
<style scoped lang="scss">
.projects-sleletons_wrapper {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
}

.projects-page {
  font-family: 'Basis Grotesque Pro', serif;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;
  color: $section-title;
  height: 100%;

  .bg-default-cover {
    background-image: url(@/assets/images/ProjectCover.svg);
  }

  .font-semithin {
    font-weight: 350;
  }
}

h1 {
  &:hover {
    color: $transparent-active-hover-bg !important;
    transition: color 0.3s ease-in;
  }
}
</style>
