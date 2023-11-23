<template>
    <div class="error-step">
        <p>To access the {{ type }}, several conditions must be met</p>
        <div class="error-step_conditions">
            <AnyNft v-if="fieldData['ANY_NFT_FROM_COLLECTION'].isIncluded"
                :isCompleted="fieldData['ANY_NFT_FROM_COLLECTION'].isVerified"
                :actionLink="fieldData['ANY_NFT_FROM_COLLECTION'].action"
                :contract-address="fieldData['ANY_NFT_FROM_COLLECTION'].contractAddress"
                :nftName="fieldData['SPECIFIC_NFT_FROM_COLLECTION']?.nftName"
                :imageUrl="fieldData['SPECIFIC_NFT_FROM_COLLECTION']?.imgUrl" />
            <SpecificNft v-if="fieldData['SPECIFIC_NFT_FROM_COLLECTION'].isIncluded"
                :isCompleted="fieldData['SPECIFIC_NFT_FROM_COLLECTION'].isVerified"
                :actionLink="fieldData['SPECIFIC_NFT_FROM_COLLECTION'].action"
                :contract-address="fieldData['SPECIFIC_NFT_FROM_COLLECTION'].contractAddress"
                :token-id="fieldData['SPECIFIC_NFT_FROM_COLLECTION'].tokenId"
                :nftName="fieldData['SPECIFIC_NFT_FROM_COLLECTION']?.nftName"
                :imageUrl="fieldData['SPECIFIC_NFT_FROM_COLLECTION']?.imgUrl" />
            <MinimumTokens v-if="fieldData['MINIMUN_AMOUNT_OF_TOKEN'].isIncluded"
                :isCompleted="fieldData['MINIMUN_AMOUNT_OF_TOKEN'].isVerified"
                :actionLink="fieldData['MINIMUN_AMOUNT_OF_TOKEN'].action"
                :contract-address="fieldData['MINIMUN_AMOUNT_OF_TOKEN'].contractAddress"
                :blockchain="fieldData['MINIMUN_AMOUNT_OF_TOKEN']?.blockchain"
                :quantity="fieldData['MINIMUN_AMOUNT_OF_TOKEN']?.quantity"
                :tokenName="fieldData['MINIMUN_AMOUNT_OF_TOKEN']?.tokenName" />
            <WhitelistCondition v-if="fieldData['WHITELIST_OF_WALLET_ADRESSES'].isIncluded"
                :isCompleted="fieldData['WHITELIST_OF_WALLET_ADRESSES'].isVerified"
                :actionLink="fieldData['WHITELIST_OF_WALLET_ADRESSES'].action" />
        </div>
        <div class="error-step_buttons">
            <div>
                <BaseButton :type="'secondary'" :text="'Cancel'" @click="() => emit('cancel', true)" />
            </div>
            <div>
                <BaseButton :type="'normal'" :text="'Verify Again'" :loading-animation="isTimerWorking"
                    :loading-dots="false" :loading-text="'Verify Again ' + timer" :disabled="isTimerWorking" @click="retry">
                    <img src="@/assets/icons/Rework.svg" class="mr-image" />
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { getTypeField, getGateFields, verifyGateCondition, getNFTImage } from "./service"

const props = defineProps({
    conditions: { type: Object, default: {} },
    type: { type: String, default: "project" },
    itemId: { type: Number, default: 0 },
})

const emit = defineEmits(['verified', 'cancel']);

const router = useRouter();

const userStore = useUserStore();

const timer = ref(0);
const isTimerWorking = ref(false);
const checked = reactive({
    success: props.conditions.success,
    error: props.conditions.error
});

const conditionGroups = computed(() => {
    return { ...props.conditions.error, ...props.conditions.success };
});

const fieldData = computed(() => {
    const typeField = getTypeField(props.type);

    return {
        ANY_NFT_FROM_COLLECTION: {
            isVerified: Object.keys(checked.success).includes('ANY_NFT_FROM_COLLECTION'),
            isIncluded: Object.keys(conditionGroups.value).includes('ANY_NFT_FROM_COLLECTION'),
            action: conditionGroups.value['ANY_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'actionButtonLink')?.value,
            contractAddress: conditionGroups.value['ANY_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'contractAddress')?.value,
            nftName: conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'nftName')?.value,
            imgUrl: getNFTImage(conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'imgUrl')?.value),
        },
        SPECIFIC_NFT_FROM_COLLECTION: {
            isVerified: Object.keys(checked.success).includes('SPECIFIC_NFT_FROM_COLLECTION'),
            isIncluded: Object.keys(conditionGroups.value).includes('SPECIFIC_NFT_FROM_COLLECTION'),
            action: conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'actionButtonLink')?.value,
            contractAddress: conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'contractAddress')?.value,
            tokenId: conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'tokenId')?.value,
            nftName: conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'nftName')?.value,
            imgUrl: getNFTImage(conditionGroups.value['SPECIFIC_NFT_FROM_COLLECTION']?.find(el => el[typeField] === 'imgUrl')?.value),
        },
        MINIMUN_AMOUNT_OF_TOKEN: {
            isVerified: Object.keys(checked.success).includes('MINIMUN_AMOUNT_OF_TOKEN'),
            isIncluded: Object.keys(conditionGroups.value).includes('MINIMUN_AMOUNT_OF_TOKEN'),
            action: conditionGroups.value['MINIMUN_AMOUNT_OF_TOKEN']?.find(el => el[typeField] === 'actionButtonLink')?.value,
            contractAddress: conditionGroups.value['MINIMUN_AMOUNT_OF_TOKEN']?.find(el => el[typeField] === 'contractAddress')?.value,
            quantity: conditionGroups.value['MINIMUN_AMOUNT_OF_TOKEN']?.find(el => el[typeField] === 'quantity')?.value,
            tokenName: conditionGroups.value['MINIMUN_AMOUNT_OF_TOKEN']?.find(el => el[typeField] === 'tokenName')?.value,
            blockchain: conditionGroups.value['MINIMUN_AMOUNT_OF_TOKEN']?.find(el => el[typeField] === 'blockchain')?.value,
        },
        WHITELIST_OF_WALLET_ADRESSES: {
            isVerified: Object.keys(checked.success).includes('WHITELIST_OF_WALLET_ADRESSES'),
            isIncluded: Object.keys(conditionGroups.value).includes('WHITELIST_OF_WALLET_ADRESSES'),
            action: conditionGroups.value['WHITELIST_OF_WALLET_ADRESSES']?.find(el => el[typeField] === 'actionButtonLink')?.value,
        },
    }
})

const setChecked = (type, valueKey, value) => {
    checked[type] = { ...checked[type], [valueKey]: value }
}

watch(checked, (value) => {
    if (!Object.keys(value.error).length) {
        emit('verified', true);
    }
});

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

const retry = async () => {
    if (isTimerWorking.value) return

    timer.value = 20;
    for (let condition in conditionGroups.value) {
        const dataObj = getGateFields(userStore.getUser.wallet, conditionGroups.value, props.type, condition);

        verifyGateCondition(props.type, props.itemId, condition, dataObj).then((canAccess) => {
            console.log('cond', condition, canAccess)
            setChecked(canAccess ? 'success' : 'error', condition, conditionGroups.value[condition])
        }).catch((error) => {
            setChecked('error', condition, conditionGroups.value[condition])
        })
    }
}
</script>

<style lang="scss" scoped>
.error-step_conditions[data-v-9aed25c3]>div {
    width: 100%;
}
.error-step {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0em;
        text-align: center;
        margin-bottom: 24px;
        color: #1A1D29;
    }

    &_conditions {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    &_buttons {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 32px;

        div {
            width: 160px;
        }

        .mr-image {
            margin-left: 8px;
        }
    }
}
</style>