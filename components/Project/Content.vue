<template>
  <ContentBox class="h-auto p-6 bg-white w-full">
    <div class="flex justify-between">
      <div class="flex items-center justify-center">
        <Blockchain :name="`${project.blockchain?.name}`" :size="18" />
        <span class="text-[#38405B] font-medium text-sm leading-5 h-5 ml-[10px]">{{
          project.blockchain?.name
        }}</span>
      </div>
      <div class="flex items-center justify-center">
        <span class="text-[#38405B] font-medium text-xs leading-5 h-5">
          On Talentum since {{ dateSince }}
        </span>
      </div>
    </div>
    <div
      class="mt-10 font-normal leading-8 text-xl text-[#1A1D29] break-words"
      v-html="project.description"
    />
    <div class="mt-7">
      <Categories show-all :categories="project.tags" />
    </div>
    <div class="mt-6">
      <h5 class="text-[#6A6D8F] text-lg leading-6">Contacts</h5>
      <div class="flex mt-4 flex-wrap">
        <a
          class="tag mr-2 mb-2 flex flex-wrap"
          v-for="provider in socialsProviders"
          :href="getLinkByProviderName(provider)"
          target="_blank"
        >
          <Icon
            class="icon"
            :icon="getIconByProviderName(provider.provider_name)"
            :size="24"
          ></Icon>
          {{ provider.name }}
        </a>
        <a
          target="_blank"
          class="tag mr-2 mb-2 flex flex-wrap"
          v-for="link in socialLinks"
          :href="link.content"
        >
          <Icon class="icon" :icon="getIconBySocialName(link.social_link)" :size="24"></Icon>
          {{ reduceStringLength(displayName(link, link.content), 30) }}
        </a>
      </div>
    </div>
  </ContentBox>
</template>

<script setup>
import { Categories, SocialTag } from '@/components';
import { reduceStringLength } from '~/util/helpers';
const props = defineProps(['project', 'dateSince', 'socialsProviders', 'socialLinks']);
const getIconByProviderName = (provider) => {
  if (provider.includes('twitter')) return 'Twitter-Default';
  if (provider.includes('telegram')) return 'Telegram-Default';
  if (provider.includes('discord')) return 'Discord-Default';
  if (provider.includes('reddit')) return 'Reddit-Default';
};
const getIconBySocialName = (social_link) => {
  if (social_link.name.toLowerCase() === 'website') return 'Web';
  if (social_link.name.toLowerCase() === 'linkedin') return 'LinkedIn-Default';
  if (social_link.name.toLowerCase() === 'telegram') return 'Telegram-Default';
  if (social_link.name.toLowerCase() === 'discord') return 'Discord-Default';
  if (social_link.name.toLowerCase() === 'reddit') return 'Reddit-Default';
};
function displayName(provider, url) {
  if (provider.social_link.name.toLowerCase() === 'linkedin') {
    const companyRegex = /\/company\/([^/]+)\//;
    const companyMatch = url.match(companyRegex);
    if (companyMatch) {
      return companyMatch[1];
    } else {
      return url;
    }
  } else if (provider.social_link.name.toLowerCase() === 'reddit') {
    const subredditPattern = /\/r\/([A-Za-z0-9_]+)/;
    const matchResult = url.match(subredditPattern);
    if (matchResult && matchResult.length > 1) {
      const subredditName = matchResult[1];
      return `r/${subredditName}`;
    }
  } else if (provider.social_link.name.toLowerCase() === 'website' && url) {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } else {
    return url;
  }
}
const getLinkByProviderName = (provider) => {
  if (provider.provider_name === 'telegram') {
    return 'https://t.me/' + provider.name.replace(' ', '');
  } else if (provider.provider_name === 'twitter') {
    return 'https://twitter.com/' + provider.name.replace(' ', '');
  }
};
</script>

<style scoped lang="scss">
.tag {
  display: flex;
  align-items: center;
  background: $default-bg;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  width: max-content;
}
.icon {
  margin-right: 10px;
}
.custom-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}
</style>
