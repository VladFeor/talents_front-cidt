<template>
    <div class="gate-verification">
        <h4 v-if="!isFailed">{{ gateType }} Gate Verification</h4>
        <h4 v-else>Get Access to the {{ gateType }}</h4>
        <VerificationStep v-if="getConditions() && !props.isVerified && !isFailed" :conditions="getConditions()"
            @finish="onVerificationEnded" :type="gateType.toLowerCase()" :item-id="data.id" />
        <SucessStep v-else-if="getConditions() && props.isVerified && !isSuccessSkipped" :type="gateType"
            :redirect-link="redirectLink" />
        <ErrorStep v-else-if="getConditions() && isFailed" :conditions="checkedConditions" @verified="handleVerified"
            :type="gateType.toLowerCase()" :item-id="data.id" @cancel="(value) => emit('cancel', value)" />
    </div>
</template>
  
<script setup>
import { useProjectsStore } from '~/store/projects';

const props = defineProps({
    isVerified: { type: Boolean, default: false },
    type: { type: String, default: "project" },
    data: { type: Object, default: {} },
    isSuccessSkipped: { type: Boolean, default: false },
    cancelAction: { type: Function, default: null }
})

const emit = defineEmits(['success', 'cancel']);

const router = useRouter();

const projectsStore = useProjectsStore();

const redirectLink = ref("");
const isFailed = ref(false);
const checkedConditions = reactive({
    error: {},
    success: {}
});

const gateType = computed(() => {
    return props.type.toLowerCase().charAt(0).toUpperCase() + props.type.slice(1)
})

const getConditions = () => {
    if (props.data.conditions && Object.keys(props.data.conditions)?.length) return props.data.conditions
    else if (props.data.chainConditions && Object.keys(props.data.chainConditions)?.length) return props.data.chainConditions
    else if (props.data.chain_conditions && Object.keys(props.data.chain_conditions)?.length) return props.data.chain_conditions
}

const handleVerified = () => {
    if (props.type === "project") {
        projectsStore.verifiedProjects.push(props.data.id);
        redirectLink.value = `/projects/${props.data.id}`;
    } else if (props.type === "task") {
        projectsStore.verifiedTasks.push(props.data.id);
        redirectLink.value = `/tasks/task/${props.data.id}`;
    }
    emit('success', true);
}

const onVerificationEnded = (value) => {
    checkedConditions.error = value.error;
    checkedConditions.success = value.success;

    if (Object.keys(value.success).length && props.data.any) { //any successful
        handleVerified();
        return;
    }

    if (Object.keys(value.error).length) {
        isFailed.value = true;
    } else {
        handleVerified();
    }
}
</script>
  
<style lang="scss" scoped>
.gate-verification {
    min-height: 232px;
    overflow: scroll !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 24px 32px 32px;

    h4 {
        font-size: 24px;
        font-weight: 400px;
        line-height: 40px;
        margin-bottom: 24px;
        color: #1A1D29;
    }

    &::-webkit-scrollbar {
        width: 6px;
        height: 90%;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: $secondary;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: $secondary;
    }
}
</style>
  