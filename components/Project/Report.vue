<template>
  <BaseModal
      :visible="reportWindow"
      @close="$emit('close')"
      max-height="360"
      width="400"
  >
    <div class="p-8 h-[360px]">
      <div class="text-gray-900 text-2xl font-normal leading-10 text-center">Why are you Reporting?</div>
      <div :class="`flex mt-6 w-full h-32 p-2 bg-white flex-col justify-start items-start rounded-lg
      ${error ? 'border border-[#CC2D14]' : 'border border-violet-200' }`">
        <template v-if="reportStep === 1">
          <button
              type="button"
              v-for="reason in reportReasons"
              class="self-stretch px-2 py-1 mb-[8px] last:mb-[0px] rounded--lg justify-start items-center rounded-lg inline-flex hover:bg-violet-100 flex"
              @click="selectedReason = reason"
          >
            <div class="grow shrink basis-0 h-6 pt-px pb-0.5 justify-start items-start gap-2.5 flex">
              <div class="text-slate-700 text-sm font-semibold leading-tight">{{ reason.type }}</div>
            </div>
            <Icon class="ml-auto" name="Tik" :size="24" v-if="selectedReason === reason" />
          </button>
        </template>
        <template v-else>
          <textarea
              v-model="reportDescription"
              class="h-[136px] w-full outline-none text-slate-400 text-base font-normal leading-normal bg-white"
              placeholder="Describe the problem in detail"
              resize="none"
          ></textarea>
        </template>
      </div>
      <template v-if="reportStep === 1">
        <button
            type="button"
            class="mt-16 w-full rounded-lg min-h-10 px-3 py-1.5 bg-orange-500 rounded--lg justify-center items-center gap-2 inline-flex"
            @click="reportStep++"
        >
          <div class="text-white text-base font-medium leading-normal">Next</div>
        </button>
      </template>
      <template v-else>
        <div class="h-6 text-[#CC2D14] mt-3 text-xs font-normal leading-none tracking-tight slashed-zero">
          <p v-show="error">Message must contain 30 characters and max must be not greater than 300 characters</p>
        </div>
        <div class="flex mt-7">
          <button
              type="button"
              class="w-10 h-10 p-2 bg-violet-200 rounded-lg justify-center items-center gap-2 inline-flex"
              @click="reportStep--"
          >
            <Icon :size="24" name="Left-Arrow"></Icon>
          </button>
          <button
              type="button"
              class="w-68 ml6 rounded-lg min-h-10 px-3 py-1.5 bg-orange-500 rounded--lg justify-center items-center gap-2 inline-flex"
              @click="sendReport"
          >
            <div class="text-white text-base font-medium leading-normal">Send</div>
          </button>
        </div>
      </template>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
const selectedReason = ref(null);
const reportStep = ref(1);
const reportDescription = ref('');
const error = ref(false);
const emits = defineEmits(['send'])
const props = defineProps({
  reportWindow: {
    type: Boolean,
    default: false
  },
  reportReasons: {
    type: Array,
    default: []
  }
})
const sendReport = () => {
  if(reportDescription.value.length < 30 || reportDescription.value.length > 300) {
    error.value = true
  } else {
    let type_id = selectedReason.value.id
    let text = reportDescription.value
    error.value = false
    emits('send', {type_id, text});
  }
}
</script>

<style scoped lang="scss">

</style>