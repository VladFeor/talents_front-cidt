<template>
    <div class="specific-nft" :class="{ completed: isCompleted, 'cursor-pointer': !!actionLink }" @click="actionRedirect">
        <div class="specific-nft_head">
            <div class="specific-nft_head_title">
                <img src="@/assets/icons/NFT.svg" alt="nft-svg" />
                <span>Specific NFT From a Collection</span>
            </div>
            <img src="@/assets/icons/big-right-arrow.svg" alt="nft-svg" v-if="!isCompleted && actionLink" />
            <img src="@/assets/icons/Tik.svg" alt="nft-svg" v-else-if="isCompleted" />
        </div>

        <div class="specific-nft_body">
            <NFTView :name="nftName" :imageUrl="imageUrl" :tokenId="tokenId" :contractAddress="contractAddress" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isCompleted: { type: Boolean, default: false },
    actionLink: { type: String, default: "" },
    contractAddress: { type: String, default: "" },
    tokenId: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    nftName: { type: String, default: '' }
})

const actionRedirect = () => {
    props.actionLink && window.open(props.actionLink, '_blank');
}
</script>

<style lang="scss" scoped>
.specific-nft {
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    background-color: #EAEAFB;
    padding: 22px 18px;
    margin-bottom: 8px;
    max-width: 416px;
    width: 100%;
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

.selected-text {
    color: #1A1D29 !important;
}
</style>