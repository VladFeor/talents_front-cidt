<template>
  <div class="task-social-card" :class="{ small: type === 'small' || windowWidth < 830 }">
    <div
      class="card-bg"
      :style="`background-image: url(${bg ? bg : `${defaultBg}`})`"
      :class="{ small: type === 'small' || windowWidth < 830 }"
    ></div>

    <div class="project-token" :class="{ 'logo-active': logo }">
      <img v-if="logo" :src="logo" alt="" />
      <img v-else src="@/assets/icons/project/eth.svg" alt="" />
    </div>
    <div class="content">
      <div class="name" :class="{ small: type === 'small' || windowWidth < 830 }">
        {{ type === 'small' ? reduceStringLength(protocol, 18) : protocol }}
      </div>
      <div
        v-if="description"
        class="desc"
        :class="{ small: type === 'small' || windowWidth < 830 }"
        v-html="
          reduceStringLength(
            description
              .replace(/<[^>]*>/g, '')
              .split('_')
              .join(' '),
            264,
          )
        "
      ></div>
      <div
        v-if="tags && tags.length"
        class="tags"
        :class="{ small: type === 'small' || windowWidth < 830 }"
      >
        <badge v-for="tag in tags" :key="tag.id" :text="tag.tag.name" type="transparent"></badge>
      </div>

      <div
        v-if="status === 'in_progress' || status === 'finished'"
        class="task-social-card_line"
      ></div>
      <div v-if="status === 'in_progress' || status === 'finished'" class="task-social-card_title">
        Your Referral Link
      </div>
      <div v-if="status === 'in_progress' || status === 'finished'" class="task-social-card_info">
        <div class="social-link_btns">
          <div @click="copy(task.invites.code)" class="social-link">
            <div class="rework-modal_user-card_text">
              {{ reduceStringLength(link, 48) }}
            </div>
            <Icon name="Insert-Link" :size="24" />
          </div>
          <div class="socials">
            <a
              :href="`https://twitter.com/intent/tweet?text=${useRuntimeConfig().public.apiLink}${
                task.invites.code
              }`"
            >
              <Icon name="Twitter-Default" :size="26" />
            </a>
            <a
              :href="`https://t.me/share/url?url=${useRuntimeConfig().public.apiLink}${
                task.invites.code
              }`"
            >
              <Icon name="Telegram-Default" :size="26" />
            </a>
            <a href="https://discord.com/channels/@me">
              <Icon name="Discord-Default" :size="26" />
            </a>
          </div>
        </div>
        <div class="social-link_invited">
          <div class="social-link_invited-title">Invited Talents</div>
          <div v-if="task" class="social-link_invited-data">
            <Icon name="Talents" :size="26" />
            <span v-if="task.task.number_of_invites"
              >{{ task.invites.count }} / {{ task.task.number_of_invites }}</span
            >
            <span v-else>Unlimited</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import defaultBg from '@/assets/images/default-avatar.png';
import windowSizeMixin from '@/mixins/windowSizeMixin';
import { reduceStringLength } from '@/util/helpers';
import { useUserStore } from '~/store/user';

const userStore = useUserStore();
const nuxtApp = useNuxtApp();

const role = computed(() => {
  const userRoles = userStore.userRoles;
  if (userRoles && userRoles.length && userRoles[0].name) {
    return userRoles[0].name;
  }
  return null;
});

const props = defineProps({
  bg: { type: String },
  task: { type: Object, default: null },
  logo: { type: String, default: '' },
  protocol: { type: String, default: 'Oasis protocol' },
  status: { type: String, default: '' },
  description: String,
  tags: Array,
  type: String,
});

const copy = async (link) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(
      `${useRuntimeConfig().public.apiLink}projects/${props.task.task.project.id}/?ref=${link}`,
    );
    nuxtApp.$alert.show('Link copied to clipboard', {
      type: 'success',
      timeout: 5000,
    });
  } else {
    unsecuredCopyToClipboard(
      `${useRuntimeConfig().public.apiLink}projects/${props.task.task.project.id}/?ref=${link}`,
    );
  }
};
const link = computed(() => {
  return `${useRuntimeConfig().public.apiLink}projects/${props.task.task.project.id}/?ref=${
    props.task.invites.code
  }`;
});
const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');

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

const { windowWidth, windowHeight, isMobile } = windowSizeMixin;
</script>

<style scoped lang="scss">
.task-social-card_info {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.social-link_invited {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  height: 96px;
  width: 200px;
  border-radius: 8px;
  border: 1px solid $default-border;
  padding-right: 10px;
  &-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: #6a6d8f;
  }
  &-data {
    display: flex;
    align-items: center;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: #38405b;
    gap: 10px;
    svg {
      margin-bottom: 4px;
    }
  }
}
.social-link_btns {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.socials {
  display: flex;
  align-items: center;
  gap: 16px;
  a {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $default-border;
    border-radius: 8px;
  }
}
.task-social-card_title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  font-feature-settings: 'zero' on;
  color: $default;
  margin-bottom: 16px;
}
.task-social-card_line {
  margin-top: 30px;
  width: 100%;
  height: 1px;
  background: $default-border;
  margin-bottom: 20px;
}
.social-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px 8px 12px;
  gap: 8px;
  width: fit-content;
  height: 40px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 6px;
  cursor: pointer;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $default;
}
.task-social-card {
  position: relative;
  background: $white;
  max-width: 760px;
  min-height: 336px;
  height: fit-content;
  width: 100%;
  border: 1px solid $default-border;
  border-radius: 16px;
  background: $default-bg;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .project-token {
    position: absolute;
    width: 32px;
    height: 32px;
    left: 24px;
    top: 24px;
    background: $default-bg;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 32px;
      height: 32px;
      border-radius: 24px;
    }
    &.logo-active {
      background-color: transparent;
    }
  }
  &.small {
    height: fit-content;
    max-width: 360px;
    min-height: 256px;
    align-items: flex-start;
    .content {
      padding: 0 16px;
    }
  }
  .card-bg {
    background-repeat: no-repeat;
    background-size: cover;
    height: 160px;
    width: 100%;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 160px;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 100%);
    }
    &.small {
      height: 136px;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 136px;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 100%);
      }
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
    width: 100%;
    display: flex;
    gap: 10px;
    padding: 0 14px;
    margin-bottom: 16px;
    flex-direction: column;
    .project {
      position: absolute;
      top: 148px;
      left: 40px;
      background: $default-bg;
      border: 1px solid $default-badge-border;
      border-radius: 6px;
      padding: 3px 8px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;
      z-index: 1000;
      &.small {
        top: 124px;
        left: 15px;
      }
    }
    .name {
      position: absolute;
      top: 90px;
      left: 15px;
      padding: 10px 16px 0 16px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $white;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      &.small {
        top: 60px;
        left: 5px;
      }
    }
    .desc {
      max-width: 704px;
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
      word-break: break-all;
      overflow: hidden;
      display: block;
      text-overflow: ellipsis;
      // padding-left: 14px;
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
      gap: 8px;
      // padding-left: 14px;
      &.small {
        margin-top: 30px;
        padding-left: 0;
      }
    }
  }
}
</style>
