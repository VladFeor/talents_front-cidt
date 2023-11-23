<template>
  <!-- <div v-if="address.is_primary" class="primary_address_wrapper">
    <div class="primary_address">
      <span>{{ address.address }}</span>
    </div>
    <div class="primary_address-title">
      This address is used for authorization and cannot be deleted.
    </div>
  </div> -->
  <div
    v-if="!address.is_primary"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    class="address-badge"
    :class="{ isDeleteMode }"
  >
    <span>{{ isDeleteMode ? reduceStringLength(address.address, 14) : reduceStringLength(address.address, 46) }}</span>
    <div v-if="isDeleteMode" class="address-badge_text">Confirm the deleting.</div>
    <div v-if="isDeleteMode" @click="isDeleteMode = false" class="address-badge_btn concel">
      <span>Cancel</span>
    </div>
    <div v-if="isDeleteMode" @click="handleConfirm" class="address-badge_btn confirm">
      <span>Confirm</span>
    </div>
    <Icon v-if="isHovered && !isDeleteMode" name="Delete" :size="20" @click="isDeleteMode = true" />
  </div>
</template>

<script setup>
import { reduceStringLength } from '@/util/helpers';

const props = defineProps({
  address: { type: Object, default: '' },
  addressId: { type: Number, default: null },
  delete: { type: Function, default: null },
});

const isHovered = ref(false);
const isDeleteMode = ref(false);

const handleConfirm = () => {
  if (props.delete && props.addressId) {
    props.delete(props.addressId);
  }
};
</script>

<style lang="scss" scoped>
.primary_address {
  width: 100%;
  display: flex;
  width: 416px;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;

  border-radius: 8px;
  border: 1px solid #ff9844;
  background: #f5f5fd;

  &_wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  span {
    color: #fc660c;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }

  &-title {
    color: #6a6d8f;
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.168px;
  }
}
.address-badge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  width: 100%;
  height: 32px;
  border: 1px solid #dad9f7;
  border-radius: 8px;
  cursor: pointer;

  &_text {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }

  &_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 24px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #801100;
    &.cancel {
      color: $secondary;
    }
    &.confirm {
      color: $red;
    }
    &:hover {
      background: $default-bg;
      border-radius: 6px;
      color: #801100;
    }
  }

  &.isDeleteMode {
    background: $white;
    border: 1px solid $error-border;
    &:hover {
      background: $white;
      border: 1px solid $error-border;
    }
  }

  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
  }
  &:hover {
    border: 1px solid transparent;
    background: $default-badge-border;
  }
}
</style>
