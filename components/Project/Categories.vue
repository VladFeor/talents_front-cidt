<template>
  <div class="flex flex-wrap text-xs justify-start items-center w-fit">
    <template v-for="(cat, index) in categories">
      <div
        v-if="index <= tagLimit || showAllTags"
        :class="`mb-2 mr-2 rounded-md py-[3px] px-[8px] h-8 ml-1 grow-0 shrink-0 basis-[25%] flex items-center ${catClass}`"
        :style="{ backgroundColor: cat.tag.colors ? cat.tag.colors.light : '#F5F5FD' }"
      >
        <span
            :style="{ color: cat.tag.colors ? cat.tag.colors.dark : '#38405B' }"
            :class="catTextClass">
          {{ cat.tag.name }}
        </span>
      </div>
      <div
        v-if="(index > tagLimit && index === (categories.length - 1)) && !showAllTags"
        class="rounded-md py-[3px] px-[8px] ml-1 cursor-pointer bh-white text-[#38405B] border border-[#EAEAFB] mb-2"
        @click.stop="expandAllTags"
      >
        <span>+{{ (categories.length - 1) - (tagLimit) }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  catClass: {
    type: String,
    default: ''
  },
  catTextClass: {
    type: String,
    default: ''
  },
  expand: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: 2
  },
  categories: {
    type: Array,
    default: null
  },
  showAll: {
    type: Boolean,
    default: false
  }
})
const tagLimit = ref(props.limit);
const showAllTags = ref(props.showAll);
const expandTags = toRef(props, 'expand');

function expandAllTags() {
  if(expandTags.value) {
    showAllTags.value = true
  }
}

</script>

<style scoped lang="scss">

</style>