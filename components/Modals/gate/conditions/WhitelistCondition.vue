<template>
    <div class="whitelist" :class="{ completed: isCompleted, 'cursor-pointer': !!actionLink }" @click="actionRedirect">
        <div class="whitelist_head">
            <div class="whitelist_head_title">
                <img src="@/assets/icons/File.svg" alt="nft-svg" />
                <span>Whitelist of Wallet Addresses</span>
            </div>
            <img src="@/assets/icons/big-right-arrow.svg" alt="nft-svg" v-if="!isCompleted && actionLink" />
            <img src="@/assets/icons/Tik.svg" alt="nft-svg" v-else-if="isCompleted" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isCompleted: { type: Boolean, default: false },
    actionLink: { type: String, default: "" }
})

const actionRedirect = () => {
    props.actionLink && window.open(props.actionLink, '_blank');
}
</script>

<style lang="scss" scoped>
.whitelist {
    width: 416px;
    border-radius: 16px;
    display: flex;
    background-color: #DAD9F7;
    padding: 22px 18px;
    margin-bottom: 8px;

    &_head {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 24px;

        &_title {
            display: flex;

            img {
                width: 24px;
                margin-right: 8px;
            }

            span {
                font-size: 16px;
                font-weight: 500;
                line-height: 24px;
                letter-spacing: 0em;
                text-align: left;
                color: #1A1D29;
            }
        }

        img {
            width: 24px;
        }
    }
}

.completed {
    background-color: #FFFFFF !important;
}
</style>