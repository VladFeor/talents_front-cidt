<template>
  <div class="community-card">
    <div class="description">
      <div class="title">Join Community for #Talents</div>
      <div class="sub-title">Discover the Talentum community on various platforms.</div>
    </div>
    <div class="content">
      <div class="info mr-5"><Icon icon="Managers" :size="40" class="color"/>50K+</div>
      <div class="social-btn">
        <div><Icon icon="Twitter-Default" :size="40" class="color"/></div>
        <div><Icon icon="Discord-Default" :size="40" class="color"/></div>
        <div><Icon icon="Telegram-Default" :size="40" class="color"/></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JoinToCard',
};
</script>

<style scoped lang="scss">
.community-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: $pink-bg;
  border-radius: 16px;
  width: 100%;
  font-style: normal;
  .description {
    flex-direction: column;
    .title {
      font-family: 'Basis Grotesque Pro';
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $default;
    }
    .sub-title {
      font-family: 'Basis Grotesque Pro';
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: $default;
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Basis Grotesque Pro';
    .info {
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $default;
    }
    .social-btn {
      display: flex;
      justify-content: space-between;
      div {
        margin: 0 8px;
        align-items: center;
        align-content: center;
        font-size: 20px;
        text-align: center;
        width: 56px;
        height: 56px;
        padding: 8px;
        background: $default;
        border-radius: 8px;
        cursor: pointer;
      }
      .color {
        filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(97deg) brightness(105%) contrast(102%);

      }
    }
  }
}
</style>
