<template>
    <div class="verification-step">
        <p>Checking if the conditions for accessing a {{ type }} match</p>
        <SetProgress :percentage="percents" />
    </div>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { getConditionGroups, getGateFields, verifyGateCondition } from "./service"

const props = defineProps({
    conditions: { type: Array, default: [] },
    type: { type: String, default: "project" },
    itemId: { type: Number, default: 0 }
});

const userStore = useUserStore();

const conditionGroups = computed(() => {
    return getConditionGroups(props.type, props.conditions);
})

const groupsCount = computed(() => Object.keys(conditionGroups.value).length);

const emit = defineEmits(['finish']);

const percents = ref(0);
const checked = reactive({
    success: {},
    error: {}
});

const setChecked = (type, valueKey, value) => {
    checked[type] = { ...checked[type], [valueKey]: value }
}

watch(percents, (value) => {
    if (value === 100) {
        emit('finish', checked);
    }
})

for (let condition in conditionGroups.value) {
    const dataObj = getGateFields(userStore.getUser.wallet, conditionGroups.value, props.type, condition);

 
    verifyGateCondition(props.type, props.itemId, condition, dataObj).then((canAccess) => {
        setChecked(canAccess ? 'success' : 'error', condition, conditionGroups.value[condition])
    }).catch((error) => {
        setChecked('error', condition, conditionGroups.value[condition])
    }).finally(() => {
        percents.value = percents.value + 100 / groupsCount.value;
    })
}

</script>

<style lang="scss" scoped>
.verification-step {
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0em;
        text-align: center;
        margin-bottom: 38px;
        color: #1A1D29;
    }
}
</style>