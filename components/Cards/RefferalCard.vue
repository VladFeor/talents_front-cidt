<template>
  <div class="refferal-card blur-card">
    <input type="hidden" :value="refLink" id="refLink" />
    <div class="title">Your Refferal Link</div>
    <div class="description">
      Invite Talent to the task using your link and you’ll get 1% of their earnings.
    </div>
    <div class="code">
      <span class="text">http://talentum.id/{{ refLink }}</span>
      <div class="shadow-copy cursor-pointer" @click="copyRefLink">
        <Icon icon="Copy" :size="24" />
      </div>
    </div>
    <div class="social-control">
      <a
        :href="`https://twitter.com/intent/tweet?text=${
          useRuntimeConfig().public.apiLink
        }${refLink}`"
      >
        <Icon icon="Twitter-Default" :size="24" class="mr-1 color" />Twitter
      </a>
      <a :href="`https://t.me/share/url?url=${useRuntimeConfig().public.apiLink}${refLink}`">
        <Icon icon="Telegram-Default" :size="24" class="mr-1 color" />Telegram
      </a>
      <a href="https://discord.com/channels/@me">
        <Icon icon="Discord-Default" :size="24" class="mr-1 color" />Discord
      </a>
    </div>
  </div>
</template>

<script setup>
import Icon from '../Icon';
const refLink = ref(Math.random().toString(18).slice(2));
const nuxtApp = useNuxtApp();

const copyRefLink = async () => {
  if (window.isSecureContext && navigator.clipboard) {
    await navigator.clipboard.writeText(`${useRuntimeConfig().public.apiLink}${refLink.value}`);
    nuxtApp.$alert.show('Link copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } else {
    unsecuredCopyToClipboard(`${useRuntimeConfig().public.apiLink}${refLink.value}`);
  }
};

const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    nuxtApp.$alert.show('Link copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
};
</script>

<style scoped lang="scss">
.refferal-card {
  max-width: 360px;
  padding: 24px;
  background: $refferal-bg;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  &.blur-card {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(5px);
    }
  }

  .title {
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;

    color: $default;
  }
  .description {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: $default;
  }

  .code {
    margin-top: 24px;
    width: 100%;
    height: 40px;
    padding: 9px;
    background: $white;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
    align-items: center;
    display: flex;
    justify-content: space-between;

    .text {
      overflow: hidden;
      width: 80%;
    }
    .shadow-copy {
      width: 20%;
      height: 16px;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      box-shadow: -19px 0px 15px 6px $white;
    }
  }
  .social-control {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div,
    a {
      background: #38405b;
      border-radius: 8px;
      padding: 4px 8px;
      color: $white;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      align-items: center;
    }
    .color {
      filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(97deg) brightness(105%)
        contrast(102%);
    }
  }
}
</style>
