<template>
    <div class="task-condition">
        <div class="task-condition_head">
            <div class="task-condition_head_title">
                {{ getConditionName(condition) }}
            </div>
            <ConditionIcon :condition="condition"/>
        </div>
        <div v-if="condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_NFT || condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_POAP"
            class="mb-2">
            <NFTView :name="conditionValues?.nftName" :imageUrl="getNFTImage(conditionValues?.imgUrl)"
                :contractAddress="conditionValues?.contract_address" :tokenId="conditionValues?.token_id" />
        </div>
        <p class="task-condition_body" v-html="getConditionDescription(condition)" />
        <div v-if="isInWork && userStore.user.wallet" class="task-condition_card">
            <a class="task-condition_card_title" :href="getConditionButtonLink(condition)" target="_blank"
                rel="noopener noreferrer">
                <img src="@/assets/icons/link.svg" alt="link" />
                {{ getConditionButtonLabel(condition) }}
            </a>
            <div class="task-condition_card_btn" :class="{ completed: isCompleted }" @click="handleVerify">
                <span v-if="!isLoading && !isCompleted">{{ buttonTitle }}</span>
                <div class="loading" v-else-if="isLoading && !isCompleted">
                    <span>&centerdot;</span>
                    <span>&centerdot;</span>
                    <span>&centerdot;</span>
                </div>
                <img v-else-if="!isLoading && isCompleted" class="completed_tik" src="@/assets/icons/Tik.svg">
            </div>
        </div>
        <div v-else-if="isInWork && !userStore.user.wallet" class="task-condition_card" @click="isShowConnectModal = true">
            <div class="task-condition_card_wallet">
                Connect Wallet
                <img src="@/assets/icons/wallet/Wallet.svg" alt="wallet"/>
            </div>
        </div>
        <div class="task-condition_loading" v-if="isLoading">
            <p>The verification process will take some time.</p>
            <p>You will receive a notification when verification is completed.</p>
        </div>
    </div>
    <BaseModal :width="480" @close="isShowConnectModal = false" :visible="isShowConnectModal" :isScrollOff="true">
        <ConnectWalletModal @close="toggleWalletConnecting" />
    </BaseModal>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { getConditionDescription, getConditionName, getConditionButtonLabel, getChainIcon, getConditionButtonLink, taskData, ON_CHAIN_CONDITIONS } from './utils';
import AxiosService from '@/service/axiosService';
import { conditionStatuses, getConditionValues } from './utils';
import { getNFTImage } from '../Modals/gate/service';

const props = defineProps({
    condition: { type: Object, default: {} },
    taskId: { type: Number, default: 0 },
    isInWork: { type: Boolean, default: false },
    verification: { type: Object, default: {} }
})

const emit = defineEmits(['pending', 'success']);

const userStore = useUserStore();
const conditionValues = getConditionValues(props.condition)
console.log('blockchain', conditionValues.value)

const isTipped = ref(false);
const isCompleted = ref(false);
const isLoading = ref(false);
const isError = ref(false);
const isShowConnectModal = ref(false);
const isTimerWorking = ref(false);
const timer = ref(0);

const taskInfo = computed(() => {
    return taskData(props.condition, userStore.user.wallet, userStore.user.id, props.taskId);
});
const buttonTitle = computed(() => {
    return isTimerWorking.value ? timer.value : "Verify";
});

const toggleWalletConnecting = () => {
  isShowConnectModal.value = !isShowConnectModal.value;
}

watch(() => props.verification, (value) => {
    if (value?.status === conditionStatuses.SUCCESS) {
        isLoading.value = false;
        isCompleted.value = true;
        emit('success', true);
    } else if (value?.status === conditionStatuses.PENDING) {
        isLoading.value = true;
        emit('pending', true);
    } else {
        isLoading.value = false;
    }
}, { deep: true, immediate: true })

watch(() => props.verification, (value) => {
    if (value?.status === conditionStatuses.ERROR || value?.status === conditionStatuses.FAILED) {
        timer.value = 10;
    }
})

watch(timer, (value) => {
    isTimerWorking.value = true;

    if (value !== 0) {
        setTimeout(() => {
            timer.value = value - 1;
        }, 1000)
    } else {
        isTimerWorking.value = false;
    }
})

const handleVerify = () => {
    if (isLoading.value || isCompleted.value || timer.value) {
        return;
    }
    isLoading.value = true;
    try {
        AxiosService.get(useRuntimeConfig().public.apiChain + `verifications/task/${taskInfo.value.endpoint}`, taskInfo.value.query).then((data) => {
            emit('pending', true);
        })
    } catch (error) {
        isError.value = true;
    }
}

</script>

<style lang="scss" scoped>
.task-condition {           
    min-width: 600px;
    background-color: #F5F5FD;
    padding: 16px;
    border-radius: 8px;

    &_head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        &_title {
            color: #6A6D8F;
            font-size: 18px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: 0em;
        }

        img {
            width: 40px;
        }
    }

    &_body {
        font-size: 20px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0em;
        text-align: left;
        color: #38405B;
        height: 100%;
    }

    &_card {
        display: flex;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0em;
        color: #38405B;
        margin-top: 28px;
        height: 40px;

        &_title {
            width: calc(100% - 82px);
            height: 100%;
            background-color: #DAD9F7;
            margin-right: 2px;
            border-radius: 8px 0px 0px 8px;
            padding: 7px 12px 7px 12px;
            display: flex;
            align-items: center;

            img {
                margin-right: 8px;
            }
        }

        &_btn {
            width: 80px;
            height: 100%;
            background-color: #DAD9F7;
            border-radius: 0px 8px 8px 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            cursor: pointer;
        }

        &_wallet {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #DAD9F7;
            border-radius: 8px;

            img {
                margin-left: 8px;
            }
        }

        .completed {
            background-color: #38405B !important;
        }

        .completed_tik {
            filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
        }

        .loading {
            font-size: 28px;

            span {
                display: inline-block;
                padding-bottom: 3px;
            }

            @keyframes loadingAnimation {

                0%,
                20% {
                    opacity: 0;
                }

                40% {
                    opacity: 1;
                }

                60% {
                    opacity: 1;
                }

                80% {
                    opacity: 1;
                }
            }

            @keyframes loadingAnimation2 {

                0%,
                20% {
                    opacity: 0;
                }

                40% {
                    opacity: 0;
                }

                60% {
                    opacity: 1;
                }

                80% {
                    opacity: 1;
                }
            }

            @keyframes loadingAnimation3 {

                0%,
                20% {
                    opacity: 1;
                }

                40% {
                    opacity: 0;
                }

                60% {
                    opacity: 0;
                }

                80% {
                    opacity: 1;
                }
            }

            span:nth-child(1) {
                animation: loadingAnimation 3s infinite;
                animation-delay: 0s;
            }

            span:nth-child(2) {
                animation: loadingAnimation2 3s infinite;
                animation-delay: 0s;
            }

            span:nth-child(3) {
                animation: loadingAnimation3 3s infinite;
                animation-delay: 0s;
            }
        }
    }

    &_loading {
        width: 100%;
        margin-top: 24px;

        p {
            width: 100%;
            color: #FC660C;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0.014em;
            text-align: right;
        }
    }
}
</style>