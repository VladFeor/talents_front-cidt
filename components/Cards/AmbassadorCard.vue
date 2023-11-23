<template>
  <card>
    <img src="@/assets/images/default-avatar.png" alt="" />
    <div class="content">
      <span class="name">{{ name }}</span>
      <slot></slot>
    </div>
  </card>
</template>

<script>
export default {
  name: 'AmbassadorCard',
  props: {
    avatar: String,
    name: {
      type: String,
      default: 'artem',
    },
  },
};
</script>

<style scoped lang="scss">
img {
  width: 88px;
  height: 88px;
  border-radius: 100%;
}
.content {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  width: calc(100% - 104px);

  .name {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
    color: $default;
  }
}
</style>
