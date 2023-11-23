<template>
  <div class="inner-wallet_wrapper">
    <div class="inner-wallet_header">
      <BackBtn
        v-if="user"
        isRounded
        :text="user.name"
        :img="user.avatar ? user.avatar : defaultBg"
        to="/"
      />
      <div class="inner-wallet_name">Inner Wallet</div>
    </div>

    <div class="inner-wallet_cards">
      <WalletCard
        title="Current Amount"
        :amount="innerWalletOverview.current_value"
        currency="USDT"
        type="amount"
      />
      <WalletCard
        title="Total Earnings"
        :amount="innerWalletOverview.total_earnings"
        currency="USDT"
        type="earn"
      />
      <WalletCard
        :title="`${innerWalletOverview.pending_requests} Pending Requests`"
        :amount="innerWalletOverview.value_pending_requests"
        currency="USDT"
        type="transparent"
      />
    </div>
    <div class="inner-wallet_table">
      <div class="filters">
        <div class="toggle_wallet_wrapper">
          <FilterToggle
            :buttons="[
              {
                title: `Project Payments`,
                id: 0,
                name: `Project Payments`,
              },
              {
                title: `Earning per Tasks`,
                id: 1,
                name: 'Earning per Tasks',
              },
              {
                title: `Withdrawal Requests`,
                id: 2,
                name: 'Withdrawal Requests',
              },
            ]"
            :id="id"
            @select="setIsShowEvents($event)"
            isFluid
          />
        </div>
        <div class="line"></div>
        <TasksSelect
          :isClear="isClear"
          :setIsClear="setIsClear"
          filter
          :options="projects"
          @input="filtersHandler($event, 'project')"
          type="project"
          :reduceLength="14"
        />

        <BlockchainSelect
          :isClear="isClear"
          :setIsClear="setIsClear"
          :options="blockChainOptions"
          @input="filtersHandler($event, 'blockchain')"
          type="create"
          :default="defaultBlockchain"
        />
      </div>
      <BaseTable
        :columns="requestsColumns"
        :rows="requestsRows"
        pointer
        title="You have no wallet requests"
        icon="icons8-futurama-bender"
        :isMultiComponents="id === 0 ? true : false"
      />
      <Pagination
        @pageChanged="nextPage($event)"
        :currentPage="currentPage"
        :totalPages="totalPages"
      />
    </div>
  </div>
  <BaseModal
    :width="560"
    :top="160"
    @close="handleCloseWithdraw($event)"
    :visible="isWithdrawModalOpen"
    isScrollOff
  >
    <WithdrawModal
      :addresses="allAddresses"
      @close="isWithdrawModalOpen = false"
      @openAddWallet="handleWithdrawAddWallet"
      :token="currentToken"
    />
  </BaseModal>
  <BaseModal
    :width="480"
    :top="160"
    @close="handleCloseManage($event)"
    :visible="isManageModalOpen"
    isScrollOff
  >
    <ManageAddressesModal @close="handleCloseManage(false)" />
  </BaseModal>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import Badge from '@/components/Badge.vue';
import Talent from '@/components/Talent.vue';
import Amount from '@/components/Amount.vue';
import AmountDetail from '@/components/AmountDetail.vue';
import Address from '@/components/InnerWallet/Address.vue';
import Hash from '@/components/InnerWallet/Hash.vue';
import MultiBadge from '@/components/InnerWallet/MultiBadge.vue';
import MultiAmount from '@/components/InnerWallet/MultiAmount.vue';
import WalletStatus from '@/components/InnerWallet/WalletStatus.vue';
import WalletRemoveBtn from '@/components/InnerWallet/WalletRemoveBtn.vue';
import Earned from '@/components/Earned.vue';
import ProjectValue from '@/components/ProjectValue.vue';
import ClaimBtn from '@/components/Buttons/ClaimBtn.vue';
import { formatDate } from '@/util/helpers';
import { useUserStore } from '~/store/user';
import { useBlockchainsStore } from '@/store/blockchains';
import { useInnerWalletStore } from '~/store/innerWallet';
import { useAddressStore } from '~/store/address';
import { useProjectsStore } from '~/store/projects';

const projectsStore = useProjectsStore();
const blockchainsStore = useBlockchainsStore();
const innerWalletStore = useInnerWalletStore();
const addressStore = useAddressStore();

onMounted(() => {
  if (route.query && route.query.tab) {
    setIsShowEvents({ id: +route.query.tab });
  }
  if (route.query && route.query.page) {
    nextPage(+route.query.page);
  }
  projectsStore.getProjectsAction();
  addressStore.getAddressesAction();
  innerWalletStore.getInnerWalletOverviewAction();
  innerWalletStore.getInnerWalletHistoryAction({ page: 1 });
  innerWalletStore.getProjectPaymentsAction({ project_id: null, page: 1 });
  innerWalletStore.getWithdrawalRequestsAction({ page: 1 });
  blockchainsStore.getBlockchainsAction();

  isMounted = true;
});

const userStore = useUserStore();
const route = useRoute();
const currentPage = ref(route.query ? route.query.page : 1);
const totalPages = ref(1);
const id = ref(0);
const isWithdrawModalOpen = ref(false);
const isManageModalOpen = ref(false);
const currentToken = ref(null);
const defaultBlockchain = ref(null);
let isMounted = false;

const walletsAddresses = computed(() => addressStore.getAddresses);

const blockChainOptions = computed(() => [
  { id: 0, name: 'All Blockchains' },
  ...blockchainsStore.getBlockchains,
]);

const allAddresses = computed(
  () => {
    if (walletsAddresses.value && walletsAddresses.value.length) {
      return walletsAddresses.value.map((item) => ({ name: item.address, ...item }));
    } else return [];
  },
  { dependsOn: [walletsAddresses], depp: true, instant: true },
);
const projects = computed(() => {
  const projectsArray = projectsStore.getProjects;
  if (!projectsArray || (projectsArray && !projectsArray.length)) {
    return [
      {
        name: 'All Projects',
        id: '',
      },
    ];
  }

  const projectsIds = projectsArray.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  const projectsOptions = [
    {
      name: 'All Projects',
      id: '',
    },
  ].concat(projectsIds);
  return projectsOptions;
});
const innerWalletOverview = computed(() => innerWalletStore.getInnerWalletOverview);
const innerWalletHistory = computed(() => innerWalletStore.getInnerWalletHistory);
const projectPayments = computed(() => innerWalletStore.getProjectPayments);
const withdrawalRequests = computed(() => innerWalletStore.getWithdrawalRequests);

watch(
  [() => id.value],
  ([id]) => {
    if (
      id === 0 &&
      projectPayments.value.pagination &&
      projectPayments.value.pagination.total_pages
    ) {
      currentPage.value = 1;
      totalPages.value = projectPayments.value.pagination.total_pages;
    }
    if (
      id === 1 &&
      innerWalletHistory.value.pagination &&
      innerWalletHistory.value.pagination.total_pages
    ) {
      currentPage.value = 1;
      totalPages.value = innerWalletHistory.value.pagination.total_pages;
    }
    if (
      id === 2 &&
      withdrawalRequests.value.pagination &&
      withdrawalRequests.value.pagination.total_pages
    ) {
      currentPage.value = 1;
      totalPages.value = withdrawalRequests.value.pagination.total_pages;
    }
  },
  { deep: true, instant: true },
);
const router = useRouter();

const filtersHandler = async (data, type) => {
  if (!isMounted) return;
  // if (!isMounted || isProjectsFilterActive.value) return;
  console.log('filtersHandler type', type);
  console.log('filtersHandler data', data);
  if (id.value === 0) {
    if (type === 'project') {
      innerWalletStore.getProjectPaymentsAction({ project_id: data.id, page: currentPage.value });
    } else if (type === 'blockchain') {
      innerWalletStore.getProjectPaymentsAction({
        blockchain_id: data.id,
        page: currentPage.value,
      });
    }
  }
  if (id.value === 1) {
    if (type === 'project') {
      innerWalletStore.getInnerWalletHistoryAction({
        project_id: data.id,
        page: currentPage.value,
      });
    } else if (type === 'blockchain') {
      innerWalletStore.getInnerWalletHistoryAction({
        blockchain_id: data.id,
        page: currentPage.value,
      });
    }
  }
  if (id.value === 2) {
    if (type === 'project') {
      innerWalletStore.getWithdrawalRequestsAction({
        project_id: data.id,
        page: currentPage.value,
      });
    } else if (type === 'blockchain') {
      innerWalletStore.getWithdrawalRequestsAction({
        blockchain_id: data.id,
        page: currentPage.value,
      });
    }
  }
};

async function setIsShowEvents(event) {
  console.log('setIsShowEvents', event.id);
  id.value = event.id;
  currentPage.value = 1;
  await nextTick();
  await router.push({ query: Object.assign({}, route.query, { tab: id.value }) });
}

const handleCloseWithdraw = (event) => {
  isWithdrawModalOpen.value = event;
};
const handleCloseManage = (event) => {
  isManageModalOpen.value = event;
};

const handleWithdrawAddWallet = () => {
  isWithdrawModalOpen.value = false;
  isManageModalOpen.value = true;
};
function nextPage(page) {
  currentPage.value = page;
  if (id.value === 0) {
    innerWalletStore.getProjectPaymentsAction({ project_id: null, page });
  }
  if (id.value === 1) {
    innerWalletStore.getInnerWalletHistoryAction({ page });
  }
  if (id.value === 2) {
    innerWalletStore.getWithdrawalRequestsAction({ page });
  }
}

const user = computed(() => userStore.getUser);
const requestsColumns = computed(() => {
  const currentId = id.value;

  if (currentId === 0) {
    return [
      { prop: 'projectValue', label: 'Project & Current Value in USDT', width: '100%' },
      { prop: 'blockchain', label: 'Blockchain', width: '50%' },
      {
        prop: 'amount',
        label: 'Amount',
        width: '60%',
      },
      { prop: 'value', label: 'Value, USDT', width: '70%' },
      { prop: 'btns', label: '', width: '30%' },
    ];
  } else if (currentId === 1) {
    return [
      { prop: 'date', label: 'Date', width: '50%' },
      { prop: 'task', label: 'Task', width: '150%' },

      { prop: 'talent', label: 'Project', width: '100%' },

      {
        prop: 'singleBlockchain',
        label: 'Blockchain',
        width: '50%',
      },
      { prop: 'singleAmount', label: 'Amount', width: '100%' },
      { prop: 'points', label: 'Quality Points', width: '70%' },
    ];
  } else if (currentId === 2) {
    return [
      { prop: 'date', label: 'Date', width: '50%' },
      { prop: 'talent', label: 'Project', width: '80%' },
      { prop: 'txhash', label: 'Txhash', width: '150%' },
      //   { prop: 'wallet', label: 'Wallet', width: '100%' },
      {
        prop: 'singleBlockchain',
        label: 'Blockchain',
        width: '70%',
      },
      { prop: 'singleAmount', label: 'Amount', width: '80%' },
      { prop: 'status', label: 'Status', width: '50%' },
      { prop: 'btns', label: '', width: '20%' },
    ];
  }
});

const requestsRows = computed(
  () => {
    if (id.value === 0) {
      const originalArray = innerWalletStore.getProjectPayments;

      console.log('originalArray projectPayments', originalArray.data);
      if (!originalArray.data) return [];
      return originalArray.data.map((item) => ({
        projectValue: {
          component: ProjectValue,
          props: {
            text: item.project.name,
            img: item.project.logo ? item.project.logo : defaultBg,
            value: item.wallets.reduce(
              (acc, val) => (acc += +Number(val.balance_in_usd).toFixed(2)),
              0,
            ),
          },
        },
        blockchain: {
          components: item.wallets.map((walletItem) => ({
            component: Badge,
            props: {
              text: walletItem.coin_type.blockchain.name,
              value: '',
              type: 'claim',
              big: false,
            },
            id: 1,
          })),
        },
        amount: {
          components: item.wallets.map((wallet) => ({
            component: AmountDetail,
            props: {
              amount: wallet.balance,
              currency: wallet.coin_type.symbol,
            },
            id: 1,
          })),
        },
        value: {
          contents: item.wallets.map((itemValue) => Number(itemValue.balance_in_usd).toFixed(2)),
        },
        btns: {
          components: item.wallets.map((value) => ({
            component: ClaimBtn,
            props: {
              text: 'Claim',
              action: () => {
                currentToken.value = {
                  symbol: value.coin_type.symbol,
                  tokenId: value.coin_type.id,
                  value: value.balance,
                  walletId: value.id,
                  typeOfChain: value.coin_type.blockchain.type_of_chain,
                };
                isWithdrawModalOpen.value = true;
              },
            },
          })),
        },
      }));
    } else if (id.value === 1) {
      const originalArray = innerWalletStore.getInnerWalletHistory;

      console.log('originalArray innerWalletHistory', originalArray.data);
      if (!originalArray.data) return [];
      return originalArray.data.map((item) => ({
        date: {
          component: Badge,
          props: {
            text: formatDate(item.created_at),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        task: {
          content: item.task.name,
        },
        talent: {
          component: Talent,
          props: {
            text: item.task.project.name,
            img: item.task.project.logo ? item.task.project.logo : defaultBg,
          },
        },
        singleBlockchain: {
          component: Badge,
          props: {
            text: item.task.coin_type.blockchain.name,
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        singleAmount: {
          component: AmountDetail,
          props: {
            amount: item.value,
            currency: item.task.coin_type.symbol,
          },
        },
        points: {
          component: Earned,
          props: {
            rating: item.points,
          },
        },
      }));
    } else if (id.value === 2) {
      const originalArray = innerWalletStore.getWithdrawalRequests;
      console.log('getWithdrawalRequests originalArray', originalArray.data);
      if (!originalArray.data) return [];
      return originalArray.data.map((item, index) => ({
        date: {
          component: Badge,
          props: {
            text: formatDate(item.created_at),
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        talent: {
          component: Talent,
          props: {
            text: item.project.name,
            img: item.project.logo ? item.project.logo : defaultBg,
          },
        },
        txhash: {
          component: Hash,
          props: {
            hash: item.tx_hash ? item.tx_hash : '',
            chainId: item.coin_type.blockchain.chain_id ? item.coin_type.blockchain.chain_id : 56,
          },
        },
        singleBlockchain: {
          component: Badge,
          props: {
            text: item.coin_type ? item.coin_type.blockchain.name : '',
            value: '',
            type: 'transparent',
            big: false,
          },
        },
        singleAmount: {
          component: AmountDetail,
          props: {
            amount: item.value,
            currency: item.coin_type.symbol.toLowerCase(),
          },
        },
        status: {
          component: WalletStatus,
          props: {
            text: item.status,
            type: item.status.toLowerCase(),
          },
        },
        btns: {
          isInvisible: true,
          component: WalletRemoveBtn,
          props: {
            index: item.id,
            page: currentPage.value,
          },
        },
      }));
    }
  },
  { dependsOn: [id, currentPage], deep: true },
);
</script>

<style lang="scss" scoped>
.requests_wrapper {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 72px;
  width: calc(100vw - 70px);
  border: 1px solid $default-border;
  border-bottom: 0;
  background-color: white;
}
.requests {
  width: 1160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;

  &_left {
    display: flex;
    gap: 16px;
  }

  &_right {
    display: flex;
    gap: 16px;
  }

  &_btns {
    display: flex;
    width: 256px;
    gap: 16px;
  }

  .font-highlighted {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 6.2;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $orange;
    &.btn {
      cursor: pointer;
    }
  }

  .font-normal {
    font-weight: normal;
    font-size: 16px;
    color: $section-title;
    line-height: 6;
    font-variant-numeric: slashed-zero;
    &.btn {
      cursor: pointer;
    }
  }

  .selects {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .ml-4 {
    margin-left: 4px;
  }
}

.inner-wallet_wrapper {
  position: relative;
  width: 1160px;
  height: auto;
  //   height: calc(100vh - 174px);
  display: flex;
  flex-direction: column;
  gap: 48px;
  margin: 0 auto;
  padding-bottom: 30px;
}
.inner-wallet_name {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 350;
  font-size: 56px;
  line-height: 72px;
  font-feature-settings: 'zero' on;
  color: $section-title;
}
.inner-wallet_cards {
  display: flex;
  gap: 16px;
}

.inner-wallet_header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.filters {
  width: 100%;
  // max-width: 488px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 28px;
  gap: 8px;
}
.toggle_wallet_wrapper {
  width: 100%;
  max-width: 488px;
}
.line {
  align-self: stretch;
  height: 32px;
  border: 0.25px solid $default-border;
}
</style>
