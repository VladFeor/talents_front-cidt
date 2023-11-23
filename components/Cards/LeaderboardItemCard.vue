<template>
  <div class="card" v-if="ambassador">
    <img v-if="ambassador.banner" class="card-bg" :src="ambassador.banner" />
    <div v-else class="card-bg"></div>
    <div class="avatar" v-if="ambassador.avatar"><img :src="ambassador.avatar" alt="" /></div>
    <div class="avatar" v-else><img src="@/assets/images/default-avatar.png" alt="" /></div>
    <div class="content">
      <div class="name">{{ ambassador.name }}</div>
      <div class="tags mt-2">
        <badge :text="ambassador.level + ' Level'" type="transparent"></badge>
        <badge :text="ambassador.total + ' QP'" type="transparent"></badge>
      </div>
      <div class="tags">
        <badge
          :text="i.activity.name"
          v-for="i in ambassador.activities.slice(0, 3)"
          :key="i.id"
          :type="getBadgeTypeByName(i.activity.name ? i.activity.name : 'All')"
        ></badge>
      </div>
    </div>
  </div>
</template>

<script>
import { getBadgeTypeByName } from '@/util/helpers';

export default {
  name: 'LeaderboardItemCard',
  data() {
    return {
      getBadgeTypeByName,
    };
  },
  props: {
    ambassador: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  cursor: pointer;
  background: $white;
  max-width: 242.67px;
  width: 292px;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 295.83px;
  overflow: hidden;
  .card-bg {
    height: 80px;
    width: 100%;
    background: url('@/assets/images/default-back.png') no-repeat;
    background-size: cover;
  }
  .avatar {
    overflow: hidden;
    border: 2px solid $white;
    border-radius: 100%;
    margin: -40px auto 16px;
    width: 90px;
    height: 90px;
  }
  .content {
    margin-bottom: 16px;
    flex-direction: column;
    .name {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      text-align: center;
      color: $default;
    }
    .tags {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      * {
        margin: 4px;
      }
    }
  }

  &:hover {
    border: 1px solid $default;
  }
}
</style>
