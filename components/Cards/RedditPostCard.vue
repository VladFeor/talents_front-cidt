<template>
  <div class="twitter-card">
    <div class="twitter-card_header column">
      <div class="justify-between flex items-center w-full" v-if="!loading">
        <div class="twitter-project w-100">
          <img :src="post.author.avatar || defaultBg" alt="" />
          <div class="twitter-project-name">
            <div class="twitter-project_title">{{ post.title }}</div>
            <div class="twitter-project_subtitle">{{ post.author.name }}</div>
          </div>
        </div>
        <div>
          <Icon name="Reddit-Default" :size="40" size="40" large />
        </div>
      </div>
      <div class="post" v-if="!loading" v-html="post.content"></div>
      <RedditActionBtn
        icon-name="Download"
        title="Save the Post"
        v-if="isSave"
        @action="goTo(url)"
        :is-disabled="disabled"
        type="reddit_save_post"
        :isVeryfied="checkStatus('reddit_save_post')"
      />
      <RedditActionBtn
        icon-name="Refferals"
        title="Vote on the Post"
        v-if="isVote"
        @action="goTo(url)"
        type="reddit_vote_post"
        :is-disabled="disabled"
        :isVeryfied="checkStatus('reddit_vote_post')"
      />
      <RedditActionBtn
        icon-name="Reply"
        title="Comment on the Post"
        v-if="isComment"
        @action="goTo(url)"
        type="reddit_comment_post"
        :isVeryfied="checkStatus('reddit_comment_post')"
        :is-disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import AxiosService from '~/service/axiosService';

const props = defineProps({
  isSave: {
    type: Boolean,
    default: false,
  },
  isVote: {
    type: Boolean,
    default: false,
  },
  isComment: {
    type: Boolean,
    default: false,
  },
  verifiers: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '',
  },
  id: { type: String, default: '' },
});
const checkStatus = (type) => {
  if (props.verifiers) {
    return props.verifiers[type];
  }
};
function goTo(link) {
  if (!props.disabled) {
    window.open(link, '_blank');
  }
}

onMounted(() => getPostInfo());
const loading = ref(true);
const post = ref(null);
const getPostInfo = () => {
  loading.value = true;
  AxiosService.get(useRuntimeConfig().public.apiBase + `reddit/post/?url=${props.url}`)
    .then((res) => {
      post.value = res.data;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
};
</script>

<style lang="scss" scoped>
.post {
  color: var(--secondary-50-oxford-blue, #38405b);
  font-variant-numeric: lining-nums tabular-nums ordinal slashed-zero;
  font-feature-settings: 'dlig' on, 'ss04' on;
  font-family: Basis Grotesque Pro;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 160% */
}
.twitter-post_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.error-message {
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
.twitter-default-tweet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // gap: 10px;
  &_url {
    display: flex;
    flex-direction: column;
    &-title {
      color: $section-title;
      font-family: Basis Grotesque Pro;
      font-size: 16px;
      font-style: bold;
      font-weight: 400;
      line-height: 32px; /* 160% */
    }
  }
  &_words {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 10px;

    color: $section-title;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px; /* 160% */
  }
}
.twiter-card_btns {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  &.column {
    width: 100%;
    flex-direction: column;
  }
}
.twitter-tweet-text {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  hanging-punctuation: first last;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
  color: #38405b;
}
.twitter-join {
  padding: 7px 12px 7px 16px;
  border-radius: 8px;
  background: #dad9f7;

  color: $default;
  font-family: Basis Grotesque Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  &.click {
    width: fit-content;
    cursor: pointer;
  }
  a {
    margin-right: 10px;
  }
  // a {
  //   color: rgba(252, 102, 12, 1);
  //   text-decoration: underline;
  // }
}
.twitter-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px 7px 16px;
  gap: 8px;
  width: fit-content;
  height: 40px;
  background: #dad9f7;
  border-radius: 8px;

  a {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #38405b;
  }
}
.twitter-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;
  width: 600px;
  min-height: 74px;
  height: auto;
  background: #f5f5fd;
  border: 1px solid #dad9f7;
  border-radius: 8px;
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.column {
      gap: 16px;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .twitter-project {
    display: flex;
    align-items: center;
    gap: 12px;
    img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
    }
    &_title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #38405b;
    }
    &_subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
}
</style>
