<template>
  <div class="modal-overlay" v-if="visible" @click.self="closeModal">
    <div class="modal-container" :style="{
      width: width + 'px',
      height: customHeight,
      top: typeof top == 'number' ? top + 'px' : top,
      right: typeof rightCustom == 'number' ? rightCustom + 'px' : rightCustom,
      transform: (rightCustom == '50%' && top == '50%') && 'translate(50%, -50%)',
      bottom: bottom + 'px',
    }">
      <div v-if="props.title" class="modal-header">
        <h2>{{ props.title }}</h2>
      </div>
      <div class="modal-body" :class="{ isScrollOff }" :style="{ maxHeight: maxHeightBody }">
        <slot></slot>
      </div>
      <button v-if="!isCloseBtnInvisible" class="close-modal-btn" :class="{ btnLeft }" @click="closeModal">
        <Icon name="Cancel" size="24" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: Number, default: 400 },
  top: { type: Number, default: '50%' },
  customHeight: { type: Number, default: 'fit-content' },
  maxHeight: { type: Number, default: 'auto' },
  maxHeightBody: { type: Number, default: '100%' },
  rightCustom: { type: Number, default: null },
  bottom: { type: Number, default: 0 },
  btnLeft: { type: Boolean, default: false },
  isConfirm: { type: Boolean, default: false },
  isCloseBtnInvisible: { type: Boolean, default: false },
  isScrollOff: { type: Boolean, default: false },
  isBlockOverflow: { type: Boolean, default: false },
});

const propsIsBlockOverflow = toRef(props, 'isBlockOverflow');
const propsVisible = toRef(props, 'visible');

watch(
  [() => propsIsBlockOverflow.value, () => propsVisible.value],
  ([blockValue, visibleValue]) => {
    if (blockValue && visibleValue) {
      document.body.classList.add('no-scroll');
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('no-scroll');
      window.scrollTo(0, 0);
    }
  },
  { deep: true, instant: true },
);

const emit = defineEmits(['close', 'openConfirmationModal']);

const visible = ref(props.visible);
const right = computed(() => window.innerWidth / 2 - props.width / 2);

function openModal() {
  visible.value = true;
}

function closeModal() {
  if (props.isCloseBtnInvisible) return;
  if (props.isConfirm) {
    emit('openConfirmationModal');
    return;
  }
  visible.value = false;
  emit('close', visible.value);
}

// watchEffect(() => {
//   if (visible.value) {
//     document.body.style.overflow = 'hidden';
//   } else {
//     document.body.style.overflow = '';
//   }
// });

watchEffect(() => {
  visible.value = props.visible;
});
</script>

<style lang="scss" scoped>
.close-modal-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 40px;
  height: 40px;
  background: #f5f5fd;
  border-radius: 24px;
  color: #38405b;
  top: -40px;
  right: -40px;
  cursor: pointer;

  &.btnLeft {
    top: 20px;
    right: 0;
    left: -50px;
  }
}

.main__slot {
  max-height: calc(100vh - 200px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 29, 41, 0.4);
  backdrop-filter: blur(4px);
  z-index: 500000;
  overflow: scroll;
}

.modal-body {
  overflow-y: scroll;
  max-height: 100%;
  height: 100%;
  &.isScrollOff {
    overflow-y: inherit;
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

.modal-container {
  position: absolute;
  background: #f5f5fd;
  border-radius: 16px;
  z-index: 20000;
  // height: fit-content;
  /* padding: 40px; */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-header button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}
</style>
