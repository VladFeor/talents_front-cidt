<template>
  <div class="directions">
    <span class="title">Directions</span>
    <div class="directions-card" v-if="!rerender">
      <div
        class="tabs"
        :class="[
          { 'tab-small': tabs.length >= 5 },
          {
            'set-up-container':
              setUpField === 'directions' || (tabs.length === 0 && setUpField === 'skills'),
          },
        ]"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :style="{
            ...defaultColor(tab),
          }"
          @click="selectTab(index)"
          :class="[{ 'tab-active': activeTab === index }, { 'small-tab': tabs.length >= 5 }]"
          v-on="{
            mouseenter: () => (hoveredButtonId = tab.id),
            mouseleave: () => (hoveredButtonId = null),
          }"
        >
          <div
            :ref="(el) => (wrappers[index] = el)"
            class="button"
            :style="{
              ...activeColor(tab),
              ...hoverColor(tab),
              ...activeHoverColor(tab),
            }"
          >
            <div v-if="hasApprove(tab.id)">
              <Icon icon="Tik-def" :size="16" class="mr-2"></Icon>
            </div>
            <div v-else-if="tab.status === 'created'">
              <Icon icon="Clock-def" :size="16" class="mr-2"></Icon>
            </div>
            {{ tab.name }}
            <div>
              <Icon icon="Cancel-def" :size="16" @click="toggleTooltip(index)" class="ml-2"></Icon>
            </div>
          </div>
          <div v-if="showTooltips[index]" id="tooltip-confirmation">
            <div class="tooltip-arrow"></div>
            <span class="msg"
              >Are you sure you want <br />
              to remove this direction?</span
            >
            <div class="contol-block mt-2">
              <div class="cancel">Cancel</div>
              <div class="confirm" @click.stop="removeTab(index)">Confirm</div>
            </div>
          </div>
        </div>
        <AddDirection
          v-if="options && tabs.length !== options.length && !loading"
          :options="options"
          :initial-selected-items="tabs"
          @add-bookmark="addTab"
          @remove-bookmark="removeTab"
          class="add-tab"
        />
      </div>

      <div class="content" v-if="tabs.length">
        <span class="title">Skills</span>
        <div v-if="loading" class="flex gap-2">
          <div class="h-8 radius bg-[#f5f5fd] w-24 mb-2.5"></div>
          <div class="h-8 radius bg-[#f5f5fd] w-24 mb-2.5"></div>
          <div class="h-8 radius bg-[#f5f5fd] w-24 mb-2.5"></div>
        </div>

        <MultiSelectWithTags
          v-else
          :class="[
            {
              'set-up-container': setUpField === 'skills',
            },
          ]"
          :options="skills"
          :initial-selected-items="userSkills"
          :blocked="activeTabObject && activeTabObject.status === 'created'"
          @selected-items="editSkills"
          @removed-items="removeSkill"
          placeholder="Find skills..."
        ></MultiSelectWithTags>
        <span class="title">Portfolio</span>
        <div v-if="loading" class="flex gap-8 flex-wrap">
          <div class="h-28 radius bg-[#f5f5fd] w-[calc(50%-1rem)] mb-2.5"></div>
          <div class="h-28 radius bg-[#f5f5fd] dark:bg-gray-600 w-[calc(50%-1rem)] mb-2.5"></div>
        </div>
        <div v-else class="portfolio-container">
          <PortfolioCard
            :blocked="activeTabObject && activeTabObject.status === 'created'"
            :status="activeTabObject && activeTabObject.status"
            :request_at="activeTabObject && activeTabObject.created_at"
            :medias="medias"
            :skills="skillsNew"
            :sources="userPortfolio"
            @save="saveActivityLink"
            @remove="removeActivityLink"
          ></PortfolioCard>
        </div>
      </div>
    </div>
    <ProfileModal v-if="showModal" @close="showModal = false">
      <div class="modal-body">
        <div class="title">Direction Request</div>
        <div class="sub-title">
          You are going to send your skills and portfolio to the Talentum Administrator.
        </div>
        <div class="direction-block">
          <badge
            :type="getBadgeTypeByName(activeTabObject.name)"
            :text="activeTabObject.name"
          ></badge>
          <div class="description">The links that confirm your competence</div>
          <SocialCard :sources="sourcesModal"></SocialCard>
        </div>
        <div class="footer-text">
          So if you have fulfilled your direction correctly, you will be approved for tasks in this
          direction.
        </div>
        <div class="controller-btns">
          <div class="cancel" @click="showModal = false">Cancel</div>
          <div @click="sendOnReview" class="save">Submit</div>
        </div>
      </div>
    </ProfileModal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '~/store/user';
import { useAssetsStore } from '~/store/assets';
import AxiosService from '~/service/axiosService';
import { getBadgeTypeByName } from '@/util/helpers';
import SocialCard from '~/components/Profile/SocialCard.vue';

const userStore = useUserStore();
const assetsStore = useAssetsStore();
let tabsData = computed(
  () =>
    userStore.getUser.activities?.map((i) => {
      return {
        status: i.status,
        created_at: i.created_at,
        ...i.activity,
      };
    }) || [],
  {
    dependsOn: [userStore.getUser.activities],
  },
);
let tabs = computed(() => tabsData.value, {
  dependsOn: [userStore.getUser.activities],
});
const rerender = ref(false);
const reload = () => {
  rerender.value = true;
  nextTick();
  rerender.value = false;
};
const setUpField = computed(() => useUserStore().getSetUpField);

const activeTab = ref(0);
const options = computed(() => assetsStore.getActivities);
const activeTabObject = computed(() => tabs.value[activeTab.value], {
  dependsOn: [userStore.getUser.activities],
});
const hoveredButtonId = ref(0);
let wrappers = [];
const showTooltips = ref(tabs.value.map(() => false));
const toggleTooltip = (index) => {
  showTooltips.value[index] = !showTooltips.value[index];
};
const showModal = ref(false);
const handleClickOutside = (event) => {
  wrappers.forEach((wrapper, index) => {
    if (wrapper && !wrapper.contains(event.target)) {
      showTooltips.value[index] = false;
    }
  });
};

const hoverColor = (tab) => {
  if (tab.colors?.light && tab.id == hoveredButtonId.value) {
    return {
      color: `${tab.colors.light}`,
      background: `${tab.colors.dark}`,
    };
  } else {
    return {};
  }
};

watch(
  () => userStore.getUser.activities,
  (newValue) => {
    if (activeTab.value + 1 > newValue.length) {
      selectTab(newValue.length > 0 ? newValue.length - 1 : 0);
    }
  },
);
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  useUserStore().needSetUp('');
});
const iconColor = (tab) => {
  if (tab.id == hoveredButtonId.value) {
    return tab.colors.main;
  } else if (tab.id == activeTabObject.value?.id) {
    return '#fff';
  } else if (tab.id == hoveredButtonId.value && tab.id == activeTabObject.value.if) {
    return tab.colors.dark;
  } else {
    return tab.colors.light;
  }
};
const activeColor = (tab) => {
  if (tab.id == activeTabObject.value?.id && tab.colors?.dark) {
    return {
      background: `${tab.colors.dark} !important`,
      color: '#fff !important',
    };
  }
  return {};
};
const defaultColor = (tab) => {
  return {
    background: `${tab.colors.light} !important`,
    color: `${tab.colors.main} !important`,
  };
};
const hasApprove = (id) => {
  return userStore.getUser.activities.find((i) => i.activity.id == id)?.status === 'approved';
};
let timeOut = ref(null);
const activeHoverColor = (tab) => {
  if (tab.id == hoveredButtonId.value && tab.id == activeTabObject.value?.id) {
    return {
      background: `${tab.colors.dark} !important`,
      color: '#fff !important',
    };
  }
  return {};
};
const skills = computed(() =>
  assetsStore.getSkills?.filter((i) => i.activity_id == activeTabObject.value?.id),
);

const userSkills = computed(
  () => {
    console.log(activeTab.value);
    if (userStore.getUser.skills.length) {
      return userStore.getUser.skills
        .filter((i) => i.skill.activity_id == activeTabObject.value?.id)
        .map((i) => {
          return i.skill;
        });
    } else {
      return [];
    }
  },
  { dependsOn: [activeTab.value] },
);
const userPortfolio = computed(
  () => {
    return userStore.getUser.activity_links.filter(
      (i) => i.activity_link.activity_id == activeTabObject.value?.id,
    );
  },

  { dependsOn: [userStore.getUser] },
);
const medias = computed(() => {
  return options.value
    .map((item) => {
      if (item.id === activeTabObject.value?.id) {
        return item.links.map((i) => {
          return {
            icon: i.link.icon,
            name: i.link.name,
            id: i.link_id,
          };
        });
      }
      return [];
    })
    .flat()
    .filter((i) => i);
});
const selectTab = (index) => {
  activeTab.value = index;
};
const loading = ref(false);
const addTab = (option) => {
  tabsData.value.push(option);
  selectTab(tabsData.value.length > 0 ? tabsData.value.length - 1 : 0);
  reload();

  if (setUpField.value === 'directions') {
    useUserStore().needSetUp('');
  }
};
const skillsNew = ref([]);

const removeSkill = (index) => {
  skillsNew.value = userStore.getUser.skills
    .map((i) => {
      return i.skill;
    })
    .filter((obj) => !index.map((i) => i.id).includes(obj.id));
};
const editSkills = (skills) => {
  useUserStore().needSetUp('');
  skillsNew.value = skills.concat(
    userStore.getUser.skills.map((i) => {
      return i.skill;
    }),
  );
};
const removeTab = (index) => {
  const isOld = tabsData.value[index].status;
  tabsData.value.splice(index, 1);
  loading.value = true;
  const newData = tabsData.value
    .filter((i) => i.status)
    .map((i) => {
      return i.id;
    });
  clearTimeout(timeOut.value);
  if (isOld) {
    timeOut.value = setTimeout(() => {
      AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
        activity_ids: newData,
      })
        .then(() => {
          useUserStore()
            .userInfo()
            .then(() => {
              loading.value = false;
            });
          showTooltips.value[index] = false;
          if (newData.length > 0) {
            selectTab(newData.length - 1);
          } else {
            selectTab(0);
          }
        })
        .catch((e) => console.log(e));
    }, 500);
  } else {
    selectTab(newData.length > 0 ? newData.length - 1 : 0);
    setTimeout(() => {
      loading.value = false;
    }, 10);
  }

  toggleTooltip(index);
};
const activityLinks = ref([]);
const sourcesModal = ref([]);
const saveActivityLink = (links) => {
  if (
    (links && links.length && skillsNew.value && skillsNew.value.length) ||
    userSkills.value ||
    userPortfolio.value
  ) {
    if (!skillsNew.value.length) {
      skillsNew.value = userSkills.value;
    }
    activityLinks.value = userStore.getUser.activity_links.map((i) => {
      return {
        id: i.id,
        activity_link_id: i.activity_link.id,
        content: i.content,
      };
    });
    sourcesModal.value = links.map((item) => {
      return {
        icon: item.icon,
        link: item.content,
      };
    });
    activityLinks.value.push(...links);
    console.log(activityLinks.value);
    showModal.value = true;
  }
};
const sendOnReview = () => {
  let linkIds = activityLinks.value.map((i) => i.activity_link_id);
  let linkIdsSet = new Set(linkIds);

  let newActivities = options.value.filter((obj) =>
    obj.links.some((link) => linkIdsSet.has(link.link_id)),
  );

  AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
    activity_ids: newActivities.map((i) => {
      return i.id;
    }),
    activity_links: activityLinks.value.map((item) => {
      if (item.icon) {
        delete item.icon;
      }
      return item;
    }),
    skill_ids: [
      ...new Set(
        skillsNew.value.map((i) => {
          return i.id;
        }),
      ),
    ],
  })
    .then(() => {
      useUserStore().userInfo();
      useUserStore().needSetUp('');

      useNuxtApp().$alert.show(
        'You have successfully submitted your request for direction approval',
        {
          type: 'success',
          timeout: 5000,
        },
      );
      showModal.value = false;

      window.dataLayer.push({
        event: 'talent_direction_update',
      });
    })
    .catch((e) => console.log(e));
};
const removeActivityLink = (link) => {
  activityLinks.value = userStore.getUser.activity_links
    .map((i) => {
      return {
        id: i.id,
        activity_link_id: i.activity_link.id,
        content: i.content,
      };
    })
    .filter((i) => i.id !== link.id);

  let linkIds = activityLinks.value.map((i) => i.activity_link_id);
  let linkIdsSet = new Set(linkIds);

  let newActivities = options.value.filter((obj) =>
    obj.links.some((link) => linkIdsSet.has(link.link_id)),
  );
  AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
    activity_ids: tabsData.value
      .filter((i) => i.status)
      .map((i) => {
        return i.id;
      }),
    activity_links: activityLinks.value.map((item) => {
      if (item.icon) {
        delete item.icon;
      }
      return item;
    }),
    skill_ids: userStore.getUser.skills.map((i) => {
      return i.skill.id;
    }),
  })
    .then(() => {
      useUserStore().userInfo();
      useNuxtApp().$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
    })
    .catch((e) => console.log(e));
};
</script>

<style scoped lang="scss">
.directions {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 410px;

  .title {
    font-family: 'Basis Grotesque Pro';
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }

  .directions-card {
    margin-top: 8px;
    .tabs {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 8px;

      .tab {
        font-family: 'Basis Grotesque Pro';
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        border-radius: 6px 6px 0 0;
        height: 50px;
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        text-align: center;
        position: relative;

        .button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 6px;
          padding: 6px 8px;
          position: relative;
        }
      }
    }

    .content {
      padding: 24px;
      background: $white;
      border: 1px solid $default-border;
      border-radius: 16px;
      width: 100%;
      margin-top: -10px;
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .title {
        font-family: 'Basis Grotesque Pro';
        font-weight: 500;
        font-size: 18px;
        line-height: 24px;
        color: $secondary;
      }
    }
  }
}
#tooltip-confirmation {
  position: absolute;
  z-index: 9999999;
  right: 0;
  width: 192px;
  height: 89px;
  margin-top: 35px;
  background: $white;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(56, 64, 91, 0.24);
  border-radius: 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  .msg {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default !important;
  }
  .contol-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    .cancel {
      background: $white;
      border-radius: 6px;
      padding: 3px 20px;
      color: $default !important;
      &:hover {
        background: $default-bg;
      }
    }
    .confirm {
      background: $white;
      border-radius: 6px;
      padding: 3px 20px;
      color: #801100 !important;
      &:hover {
        background: $default-bg;
      }
    }
  }
}
.tab-small {
  display: flex;
  gap: 3px !important;
}
.tooltip-arrow {
  position: absolute;
  top: -6px; /* половина высоты стрелки */
  left: 92%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent; /* половина ширины стрелки */
  border-right: 6px solid transparent; /* половина ширины стрелки */
  border-bottom: 6px solid $white; /* цвет стрелки */
}
.portfolio-container {
  position: relative;
}
.radius {
  border-radius: 8px;
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  align-items: center;
  .title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }
  .sub-title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }
  .direction-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 16px;
    background: $info-active-bg;
    border-radius: 16px;
    width: 100%;
    height: fit-content;
    .description {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      hanging-punctuation: first last;
      list-style-position: outside;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $section-title;
    }
  }
  .controller-btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cancel {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 7px 12px;
      gap: 8px;
      width: 156px;
      height: 40px;
      background: $default-border;
      border-radius: 8px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $default;

      &:hover {
        cursor: pointer;
        background: $not-active-border;
      }
    }
    .save {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 7px 12px;
      gap: 8px;
      width: 156px;
      height: 40px;
      background: $orange;
      border-radius: 8px;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $white;
      &:hover {
        cursor: pointer;
        background: $orange-active;
      }
    }
  }
}

.footer-text {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.014em;
  hanging-punctuation: first last;
  list-style-position: outside;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $section-title;
}

.small-tab {
  font-size: 12px !important;
  .button {
    padding: 4px !important;
  }
}
</style>
