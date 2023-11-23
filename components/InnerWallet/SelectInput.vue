<template>
  <div
    class="custom-select-address"
    :class="{
      isError: props.isError,
      project: type === 'project',
      create: type === 'create',
      disabled: props.isDisabled,
      isBig,
    }"
    :tabindex="tabindex"
    ref="selectContainer"
  >
    <!-- <div class="selected" :class="{ open }" @click="toggle"> -->
    <div v-if="selected" class="selected" :class="{ open }" @click="toggle">
      <!-- <input class="selected" type="text" :value="selected.name" /> -->
      {{ reduceStringLength(selected.name, props.reduceLength) }}
      <span class="arrow-task" :class="{ flipped: open }"></span>
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div v-if="filter" class="input-project-wrapper">
        <Icon class="search-icon" name="Search" :size="18" />
        <input @input="filterProjects($event)" type="text" placeholder="Find a Project..." />
      </div>
      <div v-for="(option, i) in customOptions" :key="i" @click.stop="selectOption(option)">
        <span v-html="highlightMatch(reduceStringLength(option.name, props.reduceLength))"></span>
        <!-- {{ reduceStringLength(option.name, props.reduceLength) }} -->
        <!-- <Icon v-if="selected.id === option.id" name="Tik" :size="20" color="#38405B" /> -->
      </div>
      <div class="empty-options" v-if="!customOptions || (customOptions && !customOptions.length)">
        <span>No projects</span>
      </div>
    </div>
    <div v-if="errorText && isError" class="select-error">
      {{ errorText }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount, computed } from 'vue';
import { reduceStringLength } from '@/util/helpers';
import { TYPE_OF_CHAIN } from '~/web3/connection';
import { ethers } from 'ethers';
import { isValidSeiAddress } from '@sei-js/core';
import { isValidTronAddress, isValidAptosAddress } from '~/web3/helpers';

const props = defineProps({
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
  type: { type: String, default: '' },
  filter: { type: Boolean, default: false },
  isClear: { type: Boolean, default: false },
  setIsFilterActive: { type: Function, default: () => console.log('filter projects') },
  setIsClear: { type: Function, default: () => console.log('set is clear') },
  isDisabled: { type: Boolean, default: false },
  isError: { type: Boolean, default: false },
  errorText: { type: String, default: '' },
  reduceLength: {
    type: Number,
    required: false,
    default: 45,
  },
  isBig: { type: Boolean, default: false },
  typeOfChain: { type: Boolean, default: false },
});

const checkIsDefaultAddressValid = (options) => {
  if (!options) return null;
  if (
    props.typeOfChain === TYPE_OF_CHAIN.EVM &&
    options.some((item) => ethers.utils.isAddress(item.address))
  ) {
    return options.find((item) => ethers.utils.isAddress(item.address));
  } else if (
    props.typeOfChain === TYPE_OF_CHAIN.TRON &&
    options.some((item) => isValidTronAddress(item.address))
  ) {
    return options.find((item) => isValidTronAddress(item.address));
  } else if (
    props.typeOfChain === TYPE_OF_CHAIN.APTOS &&
    options.some((item) => isValidAptosAddress(item.address))
  ) {
    return options.find((item) => isValidAptosAddress(item.address));
  } else if (
    props.typeOfChain === TYPE_OF_CHAIN.SEI &&
    options.some((item) => isValidSeiAddress(item.address))
  ) {
    return options.find((item) => isValidSeiAddress(item.address));
  } else return null;
};

const emit = defineEmits(['input']);

const selected = ref(checkIsDefaultAddressValid(props.options.length > 0 ? props.options : null));
const open = ref(false);
const filteredOptions = ref(props.options);
const selectContainer = ref(null);
const searchValue = ref('');

const defaultPropRef = toRef(props, 'default');
const optionsPropRef = toRef(props, 'options');

watch(
  optionsPropRef,
  (value) => {
    if (value) {
      selected.value = checkIsDefaultAddressValid(value.length > 0 ? value : null);
    }
  },
  { deep: true, instant: true },
);

watch(
  defaultPropRef,
  (value) => {
    if (value) {
      selected.value = value;
    }
  },
  { deep: true, instant: true },
);

const customOptions = computed(() => {
  const originalObj = filteredOptions.value;

  if (props.typeOfChain === TYPE_OF_CHAIN.EVM) {
    return originalObj.filter((item) => ethers.utils.isAddress(item.address));
  } else if (props.typeOfChain === TYPE_OF_CHAIN.TRON) {
    return originalObj.filter((item) => isValidTronAddress(item.address));
  } else if (props.typeOfChain === TYPE_OF_CHAIN.APTOS) {
    return originalObj.filter((item) => isValidAptosAddress(item.address));
  } else if (props.typeOfChain === TYPE_OF_CHAIN.SEI) {
    return originalObj.filter((item) => isValidSeiAddress(item.address));
  } else return [];
});

const toggle = () => {
  if (props.isDisabled) return;
  open.value = !open.value;
};

const selectOption = (option) => {
  if (props.filter) {
    props.setIsFilterActive(false);
  }
  selected.value = option;
  toggle();
  emit('input', option);
};

const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    open.value = false;
  }
};

const highlightMatch = (name) => {
  // const searchInput = props.filter.toLowerCase();
  const searchInput = searchValue.value.toLowerCase();
  const itemName = name.toLowerCase();

  let highlightedName = '';
  let startIndex = 0;

  for (let i = 0; i < searchInput.length; i++) {
    const char = searchInput[i];

    const index = itemName.indexOf(char, startIndex);
    if (index !== -1) {
      highlightedName += name.substring(startIndex, index);
      highlightedName += `<span class="highlight">${name.substring(index, index + 1)}</span>`;
      startIndex = index + 1;
    } else {
      break;
    }
  }

  highlightedName += name.substring(startIndex);

  return highlightedName;
};

const filterProjects = (event) => {
  props.setIsFilterActive(true);
  if (event.target.value) {
    searchValue.value = event.target.value;
    filteredOptions.value = props.options.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase()),
    );
  } else {
    filteredOptions.value = props.options;
    searchValue.value = '';
  }
};

watch(
  () => props.options,
  (newOptions) => {
    filteredOptions.value = newOptions;
  },
);

watch(
  () => props.isClear,
  (value) => {
    if (value) {
      selectOption(props.options[0]);
      open.value = false;
      props.setIsClear(false);
    }
  },
);

onBeforeMount(() => {
  if (props.options.length > 0) {
    filteredOptions.value = props.options;
  }
  emit('input', selected.value);
  document.addEventListener('click', handleClickOutside);
});
</script>

<style lang="scss">
.highlight {
  color: $highlight;
}
.select-error {
  color: $error-text;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}
.input-project-wrapper {
  position: relative;
  .search-icon {
    position: absolute;
    left: 14px;
    top: 10px;
  }
  input {
    width: 100%;
    height: 32px;
    background: #ffffff;
    border: 1px solid #dad9f7;
    border-radius: 8px;
    padding-left: 30px;
    outline: none;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    display: flex;
    align-items: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #aaa7cc;
  }
}
.custom-select-address {
  position: relative;
  width: 100%;
  height: 32px;
  text-align: left;
  outline: none;
  z-index: 640;
  &.isBig {
    height: 40px;
    .selected {
      height: 40px;
      line-height: 2.2;
      &.open {
        line-height: 2.2;
      }
    }
    .arrow-task {
      top: 17px;
      cursor: pointer;
    }
    .items {
      top: 51px;
    }
    &.disabled {
      height: 40px;
      .arrow-task {
        top: 17px;
      }
      .selected {
        line-height: 2.2;
        background: $default-border;
        color: $secondary;
        cursor: text;
        height: 40px;
        &.open {
          line-height: 2.2;
        }
      }
    }
  }
  &.disabled {
    .selected {
      background: $default-border;
      color: $secondary;
      cursor: text;
    }
  }
  &.isError {
    .selected {
      border: 1px solid $red;
      &.open {
        border: 1px solid $red;
      }
    }
    &.create {
      width: 240px;
      height: 40px;
      .selected {
        width: 240px;
        height: 40px;
        line-height: 2.2;
        &.open {
          line-height: 2.2;
        }
        .arrow-task {
          top: 16px;
        }
      }
      .items {
        top: 51px;
      }
    }
  }
  &.create {
    width: 240px;
    height: 40px;
    .selected {
      width: 240px;
      height: 40px;
      line-height: 2.2;
      &.open {
        line-height: 2.2;
      }
      .arrow-task {
        top: 16px;
      }
    }
    .items {
      top: 51px;
    }
    // .selected.open {
    //   box-shadow: none;
    // }
  }
  //   &.project {
  //     width: 200px;
  //     .selected {
  //       width: 200px;
  //     }
  //   }
}

.custom-select-address .selected {
  background: $white;
  border: 1px solid $default-border;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  padding: 4px 8px;
  width: 100%;
  height: 32px;
  color: #38405b;
  outline: none;
}

.custom-select-address .selected.open {
  background: $white;
  border: 1px solid $default-badge-border;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.7;
  color: $default;
  box-shadow: 0 0 0 3px $default-border;
}

.custom-select-address .selected:after {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
}

.arrow-task {
  position: absolute;
  content: '';
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
  cursor: pointer;

  background: url('@/assets/images/select.svg');
  background-repeat: no-repeat;
}

.arrow-task.flipped {
  transform: rotate(180deg);
}

.custom-select-address .items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  background: $white;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  border-radius: 0 0 4px 4px;
  line-height: 20px;
  color: $default;
  overflow: hidden;
  border-right: 1px solid $default-badge-border;
  border-left: 1px solid $default-badge-border;
  border-bottom: 1px solid $default-badge-border;
  position: absolute;
  left: 0;
  right: 0;
  top: 40px;
  z-index: 1;
  border-radius: 8px;
  overflow: inherit;
  max-height: 368px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    height: 100%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }
  &.selectHide {
    display: none;
  }
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $white;
    z-index: -1;
    top: 14px;
    left: 50%;
    right: 50%;
    transform: rotate(45deg) translate(-50%, -10%);
  }
}

.custom-select-address .items div:not(.empty-options) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $default;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  white-space: nowrap;
}
.empty-options {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 4px 8px;
}
.custom-select-address .items div:not(.input-project-wrapper, .empty-options):hover {
  background-color: $default-border;
  border-radius: 8px;
}
</style>
