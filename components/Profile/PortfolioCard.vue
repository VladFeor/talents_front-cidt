<template>
  <div class="portfolio">
    <div v-for="(source, index) in localSources" :key="index" class="info">
      <div>
        <img :src="source.activity_link.link.icon" width="40" height="40" />
      </div>
      <div class="close" @click="removeSource(source)" v-if="!blocked">
        <Icon icon="Cancel" :size="16"></Icon>
      </div>
      <div class="source">
        <div class="flex justify-between w-full">
          <a
            :href="isURL(source.content) ? source.content : `https://${source.content}`"
            target="_blank"
            class="title"
            >{{ source.content }}
          </a>
        </div>
        <span class="social-name">{{ source.activity_link.link.name }}</span>
      </div>
    </div>

    <div v-for="(source, index) in newSocial" :key="index" class="new-item">
      <div class="header">
        <div class="title">Select a service and add a link</div>
        <SourceSelect :options="medias" class="select" @input="newSocial[index].social = $event" />
      </div>
      <div class="input-wrapper">
        <input
          class="custom-input"
          type="text"
          v-model="newSocial[index].content"
          :placeholder="`https://${newSocial[index].social.name.toLowerCase()}.com/`"
        />

        <Icon
          :icon="link().test(newSocial[index].content) ? 'Tick' : 'Tik'"
          class="input-icon"
          :size="24"
        ></Icon>
      </div>
    </div>

    <div
      class="add"
      @click="addNewSource"
      v-if="!blocked && (newLinksWell || newSocial.length === 0)"
    >
      <Icon icon="Create" :size="16" class="icon"></Icon>
    </div>
  </div>
  <div v-if="newLinksWell && !status && skills.length && newSocial.length">
    <div class="save">
      <div class="btn" @click="saveSource()">Send on Review</div>
    </div>
  </div>
  <div class="save" v-else-if="!status">
    <div class="btn-disabled">Send on Review</div>
  </div>
  <div class="pending" v-if="status === 'created'">
    You sent a request for approval {{ formatted }}
    <div class="btn"><Icon icon="Clock" :size="24" class="icon"></Icon> Pending</div>
  </div>
  <div class="approved" v-if="status === 'approved'">
    <span class="w-full">The direction was approved {{ formatted }}</span>
    <div class="save" v-if="newLinksWell && newSocial.length">
      <div class="btn" @click="saveSource()">Send on Review</div>
    </div>

    <div class="save" v-else-if="!status">
      <div class="btn-disabled">Send on Review</div>
    </div>
  </div>
  <div class="declined" v-if="status === 'declined'">
    The direction was disapproved {{ formatted }}
    Add relevant cases to your portfolio and send on review again.
    <div class="save">
      <div v-if="newLinksWell && newSocial.length" class="btn" @click="saveSource()">
        Send on Review
      </div>
      <div class="save" v-else-if="!status">
        <div class="btn-disabled">Send on Review</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, reactive, toRefs } from 'vue';
import { link } from '@/util/validations';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default {
  name: 'PortfolioCard',
  props: {
    sources: {
      type: Array,
      default: () => [],
    },
    medias: {
      type: Array,
      default: () => [],
    },
    skills: {
      type: Array,
      default: () => [],
    },
    status: {
      type: String,
      default: '',
    },
    request_at: {
      type: String,
      default: '',
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['save', 'remove'],
  setup(props, { emit }) {
    const state = reactive({
      localSources: [...props.sources],
      defImg:
        'https://catapultdevspace.fra1.digitaloceanspaces.com/develop/link-icons/82/internet.svg',
    });
    let newSocial = ref([]);
    let newLinksWell = computed(() => newSocial.value.every((item) => link().test(item.content)));
    watch(
      () => [props.sources, props.medias],
      () => {
        state.localSources = [...props.sources];
        newSocial.value = [];
      },
    );
    const addNewSource = () => {
      const newSource = {
        social: {
          name: '',
        },
        content: '',
      };
      newSocial.value.push(newSource);
    };

    const removeSource = (link) => {
      emit('remove', link);
    };
    const saveSource = () => {
      console.log(newSocial.value);
      emit(
        'save',
        newSocial.value
          .filter((item) => link().test(item.content))
          .map((item) => {
            return {
              activity_link_id: item.social.id,
              content: item.content,
              icon: item.social.icon,
            };
          }),
      );
    };

    const formatted = computed(() => {
      const date = parseISO(props.request_at);
      if (!isNaN(date))
        return `${formatDistanceToNow(date, { addSuffix: true })} on ${date.toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        )}`;
    });
    function isURL(str) {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/\S*)?$/i;
      return urlPattern.test(str) && !str.startsWith('www');
    }
    return {
      isURL,
      ...toRefs(state),
      addNewSource,
      formatted,
      removeSource,
      newSocial,
      link,
      saveSource,
      newLinksWell,
    };
  },
};
</script>

<style scoped lang="scss">
.portfolio {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .info {
    width: calc(50% - 8px);
    height: 104px;
    background: $default-bg;
    border: 1px solid $default-border;
    display: flex;
    padding: 24px;
    border-radius: 8px;
    position: relative;
    .close {
      width: 24px;
      height: 24px;
      padding: 6px;
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-top: -15px;
      position: absolute;
      right: 0;
      &:hover {
        background: $default-badge-border;
        border-radius: 6px;
      }
    }

    .source {
      margin-left: 16px;
      display: flex;
      width: 80%;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      .title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        height: 24px;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $default;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .social-name {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $colabs-bg;
      }
    }
  }
  .add {
    width: calc(50% - 8px);
    height: 104px;
    background: $default-bg;
    border: 1px dashed $default-border;
    border-radius: 8px;
    .icon {
      position: relative;
      left: calc(50% - 16px);
      top: calc(50% - 16px);
    }
  }
  .new-item {
    background: $white;
    width: calc(50% - 8px);
    height: 104px;
    border: 1px solid $default-badge-border;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      .title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        font-feature-settings: 'zero' on;
        color: $section-title;
      }
    }
    .input-wrapper {
      position: relative;
      background: $white;
      border: 1px solid $default-badge-border;
      border-radius: 8px;
      input {
        padding: 4px 8px;
        outline: none;
        border: none;
        border-radius: 8px;
        background: $white;
        color: $section-title;
        width: 90%;
        &::placeholder {
          font-family: 'Basis Grotesque Pro';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
          color: $colabs-bg;
          border-radius: 8px;
        }
      }
      .input-icon {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
.save {
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;

  .btn {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    gap: 8px;
    width: fit-content;
    height: 32px;
    background: $orange;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $white;

    &:hover {
      cursor: pointer;
      background: $orange-active;
    }
  }
}
.declined {
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  margin-top: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  align-items: center;
  color: $orange;
  .save {
    margin-top: 0;
  }
  .btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: 32px;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    .icon {
      filter: invert(280%) sepia(13%) saturate(792%) hue-rotate(193deg) brightness(84%)
        contrast(89%);
    }
  }
}
.pending {
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  margin-top: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
  align-items: center;
  .btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    width: 99px;
    padding: 4px 12px 4px 8px;
    height: 32px;
    border: 1px solid $default-border;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $colabs-bg;
    .icon {
      filter: invert(280%) sepia(13%) saturate(792%) hue-rotate(193deg) brightness(84%)
        contrast(89%);
    }
  }
}
.approved {
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  margin-top: 24px;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
  align-items: center;
  .save {
    margin-top: 0;
  }
  .btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: 32px;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    .icon {
      filter: invert(280%) sepia(13%) saturate(792%) hue-rotate(193deg) brightness(84%)
        contrast(89%);
    }
  }
}
.btn-disabled {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  width: fit-content;
  height: 32px;
  background: $colabs-bg;
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  font-feature-settings: 'zero' on;
  color: $white;
  cursor: not-allowed;
}
</style>
