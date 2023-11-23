<template>
  <div class="add-address-btn"><span>Add Address</span> <Icon name="Add" :size="20" /></div>
</template>

<script setup></script>

<style lang="scss" scoped>
.add-address-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  width: 131px;
  height: 32px;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $secondary;
  &:hover {
    background: $default-badge-border;
    color: $default;
  }
}
</style>
