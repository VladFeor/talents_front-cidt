<template>
    <div class="nft-view">
        <div v-if="name && imageUrl" class="nft-container">
            <div class="nft-image-container">
                <img alt="preview" :src="imageUrl" />
            </div>
            <div class="nft-data-container">
                <div class="nft-header">
                    <span class="label">{{ name }}</span><span class="label" v-if="tokenId"> #{{ tokenId }}</span>
                    <!-- <span class="text-small"> | ID ???</span> -->
                </div>
                <div class="nft-body">
                    <div class="label">{{ name }}</div>
                    <div v-if="contractAddress" class="text-small">
                        <span>{{ contractAddress }}</span>
                        <span> | ERC-721</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="contractAddress">
            <div class="text-small">{{ contractAddress }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['name', "tokenId", "contractAddress", "imageUrl"])

</script>

<style lang="scss">
.nft-view {
    .nft-container {
        display: flex;
        align-items: center;

        .nft-image-container {
            max-width: 98px;
            width: 98px;
            border-radius: 8px;
            overflow: hidden;
        }

        .nft-data-container {
            padding: 11px 0 11px 8px;
            word-break: break-all;
        }
    }

    .label {
        //styleName: Label;
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: left;
        color: #1A1D29;
    }

    .text-small {
        //styleName: Text Small;
        font-family: Basis Grotesque Pro;
        overflow: hidden;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: left;
        color: #6A6D8F;
    }
}
</style>