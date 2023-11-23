<template>
  <div class="card" :class="{ small: type === 'small' || windowWidth < 830 }">
    <img
      class="card-bg"
      :class="{ small: type === 'small' || windowWidth < 830 }"
      :src="bg ? bg : defaultBg"
    />
    <div class="content">
      <div class="name" :class="{ small: type === 'small' || windowWidth < 830 }">
        {{ protocol }}
      </div>
      <div class="desc" :class="{ small: type === 'small' || windowWidth < 830 }">
        {{ description.replace(/<[^>]*>/g, '') }}
      </div>
      <div class="tags">
        <badge text="123132" type="transparent"></badge>
        <badge text="123132" type="transparent"></badge>
        <badge text="123132" type="transparent"></badge>
        <badge text="123132" type="transparent"></badge>
        <badge text="12" type="transparent"></badge>
        <badge text="123132" type="image" :img="defaultBg"></badge>
      </div>
    </div>
  </div>
</template>

<script>
import defaultBg from '@/assets/images/default-avatar.png';
import windowSizeMixin from '@/mixins/windowSizeMixin';

export default {
  name: 'ProtocolCard',
  mixins: [windowSizeMixin],
  data() {
    return {
      defaultBg,
    };
  },
  props: {
    bg: { type: String },
    protocol: { type: String, default: 'Oasis protocol' },
    description: String,
    tags: Array,
    type: String,
  },
};
</script>

<style scoped lang="scss">
.card {
  position: relative;
  background: $white;
  max-width: 760px;
  height: 336px;
  width: 100%;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 336px;
  overflow: hidden;
  &.small {
    height: fit-content;
    max-width: 350px;
  }
  .card-bg {
    height: 160px;
    width: 100%;
    &.small {
      height: 96px;
    }
  }
  .avatar {
    border: 2px solid $white;
    border-radius: 100%;
    margin: -40px auto 16px;
    width: 90px;
    height: 90px;
  }
  .content {
    padding: 0 24px;
    margin-bottom: 16px;
    flex-direction: column;
    .name {
      position: absolute;
      top: 110px;
      left: 25px;
      background: $white;
      padding: 10px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $default;
      &.small {
        position: inherit;
      }
    }
    .desc {
      position: relative;
      z-index: 10;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      margin-top: 30px;
      &.small {
        display: none;
      }
    }
    .tags {
      margin-top: 16px;
      display: flex;
      justify-content: flex-start;
      align-content: center;
      flex-wrap: wrap;
      * {
        margin: 4px;
      }
    }
  }
}
</style>
