<template>
  <button v-if="icon === 'Tron-Default'" @click="fn()">
    <img class="social-icon" :src="tronlink" alt="" />
  </button>
  <button v-else-if="icon === 'Aptos'" @click="fn()">
    <img class="social-icon" :src="petra" alt="" />
  </button>
  <button v-else @click="fn()">
    <Icon :icon="icon" :size="24"></Icon>
  </button>
</template>

<script>
import { petra, tronlink } from '@/constants/icons';

export default {
  name: 'SocialButton',
  props: {
    icon: {
      type: String,
      default: 'Tik',
    },
    fn: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      tronlink,
      petra,
    };
  },
};
</script>

<style scoped lang="scss">
button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: $white;
  border: 1px solid $default-badge-border;
  border-radius: 32px;
  &:hover {
    border: 1px solid $default;
  }
}

.social-icon {
  width: 24px;
  height: 24px;
}
</style>
