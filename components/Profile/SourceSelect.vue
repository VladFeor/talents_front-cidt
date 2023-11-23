<template>
  <div class="custom-select" :tabindex="tabindex" ref="selectContainer">
    <div class="selected" :class="{ open }" @click="toggle">
      <img :src="selected.icon" width="16" />
      <span class="arrow" :class="{ flipped: open }"></span>
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div
        v-for="(option, i) in filteredOptions"
        class="item"
        :key="i"
        :style="{ 'z-index': i++ }"
        @click.stop="selectOption(option)"
      >
        <div class="flex items-center">
          <img :src="option.icon" width="16" />
          <span class="ml-2">{{ option.name }}</span>
          <icon v-if="option.name === selected.name" icon="Tik" class="ml-2" :size="24"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onBeforeMount } from 'vue';
import Icon from '../Icon';

export default {
  components: { Icon },
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const selected = ref(props.default || (props.options.length > 0 ? props.options[0] : null));
    console.log(selected);
    const open = ref(false);
    const selectContainer = ref(null);
    const search = ref('');

    const toggle = () => {
      open.value = !open.value;
    };

    const selectOption = (option) => {
      selected.value = option;
      toggle();
      emit('input', option);
      console.log(option);
    };

    const handleClickOutside = (event) => {
      if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
      }
    };

    const filteredOptions = computed(() => {
      if (!search.value) return props.options;
      return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()),
      );
    });

    onBeforeMount(() => {
      emit('input', selected.value);
      document.addEventListener('click', handleClickOutside);
    });

    return {
      selected,
      open,
      selectContainer,
      toggle,
      selectOption,
      search,
      filteredOptions,
    };
  },
};
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  max-width: 100%;
  text-align: left;
  outline: none;
  line-height: 47px;
}

.custom-select .selected {
  background: $default-bg;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 8px;
  width: 60px;
  height: 32px;
  color: $default;
  display: flex;
  z-index: 99;
}

.custom-select .selected.open {
  background: $default-bg;
  border: 1px solid $default-badge-border;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: $default;
}

.custom-select .selected:after {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
}

.arrow {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
}

.arrow.flipped {
  transform: rotate(180deg);
}
.first {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}
.custom-select .items {
  background: $white;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  z-index: 1000;
  border-radius: 8px;
  margin-top: 5px;
  padding: 4px;
  line-height: 20px;
  color: $default;
  border: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  max-height: 250px;
  min-width: 180px;
}
hr {
  margin: 4px 0;
  color: #dad9f7;
}
.custom-select .items div {
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px;
}

.item:hover {
  background-color: $default-badge-border;
  border-radius: 8px;
}
.item {
  display: flex;
  align-items: center;
  width: 100%;
}
.selectHide {
  display: none;
}
.search-container {
  position: relative;
}

.search {
  width: 100%;
  height: 32px;
  border: 1px solid $default-badge-border;
  background: none !important;
  outline: none !important;
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $default;
  padding-left: 30px;

  &::placeholder {
    color: $colabs-bg;
  }
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: $colabs-bg;
  pointer-events: none; /* чтобы иконка не блокировала события ввода */
}
</style>
