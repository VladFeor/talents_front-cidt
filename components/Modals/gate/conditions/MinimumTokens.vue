<template>
    <div class="minimum-tokens" :class="{ completed: isCompleted, 'cursor-pointer': !!actionLink }" @click="actionRedirect">
        <div class="minimum-tokens_head">
            <div class="minimum-tokens_head_title">
                <img src="@/assets/icons/wallet/Wallet.svg" alt="nft-svg" />
                <span>Minimum Amount of Token</span>
            </div>
            <img src="@/assets/icons/big-right-arrow.svg" alt="nft-svg" v-if="!isCompleted && actionLink"
                @click="actionRedirect" />
            <img src="@/assets/icons/Tik.svg" alt="nft-svg" v-else-if="isCompleted" />
        </div>

        <div class="minimum-tokens_body">
            <div class="minimum-tokens_body_label">
                <Blockchain :name="'Ethereum'" :size="24" />
                {{ blockchain }}
            </div>
            <div class="minimum-tokens_body_amount">
                <!-- <img src="@/assets/icons/Tokens.svg" /> -->
                <span>{{ quantity }} {{ tokenName }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isCompleted: { type: Boolean, default: false },
    actionLink: { type: String, default: "" },
    contractAddress: { type: String, default: "" },
    quantity: { type: Number },
    tokenName: { type: String, default: '' },
    blockchain: { type: String, default: '' }

})

const actionRedirect = () => {
    props.actionLink && window.open(props.actionLink, '_blank');
}
</script>

<style lang="scss" scoped>
.minimum-tokens {
    width: 416px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    background-color: #DAD9F7;
    padding: 22px 18px;
    margin-bottom: 8px;

    &_head {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 24px;
        margin-bottom: 16px;

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

    &_body {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &_text {
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            letter-spacing: 0.014em;
            color: #6A6D8F;
        }

        &_label {
            display: flex;
            align-items: center;
            width: 155px;
            height: 32px;
            padding: 4px 16px 4px 12px;
            border-radius: 8px;
            background-color: #F5F5FD;
            border: 1px solid #DAD9F7;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0.014em;
            color: #38405B;
        }

        &_amount {
            display: flex;
            align-items: center;

            img {
                margin-right: 6px;
                height: 24px;
            }

            span {
                font-size: 20px;
                font-weight: 400;
                line-height: 32px;
                letter-spacing: 0em;
                color: #1A1D29;
            }
        }
    }
}

.completed {
    background-color: #FFFFFF !important;
}
</style>