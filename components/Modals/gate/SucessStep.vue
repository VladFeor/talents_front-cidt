<template>
    <div class="success-step">
        <p>Well Done!</p>
        <BaseButton :type="'action'" :text="`Enter the ${type}`" @click="router.push(redirectLink)" />
    </div>
</template>

<script setup>
import { useProjectsStore } from '~/store/projects';

const props = defineProps({
    redirectLink: { type: String, default: "" },
    type: { type: String, default: "Project" }
});

const router = useRouter();

const projectsStore = useProjectsStore();
</script>

<style lang="scss" scoped>
.success-step {
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
    }
}
</style>