<template>
  <div class="tabs_wrapper">
    <info-toggle
      :buttons="[
        { title: 'Days', id: 0 },
        { title: 'List', id: 1 },
      ]"
      :id="0"
      class="btns"
      @select="id = $event"
    ></info-toggle>
    <div class="calendar_wrapper" :class="{ none: id == 1 }" ref="calendarRef">
      <div class="tooltip">
        <div v-for="(data, i) in tooltipData" :key="data + i" class="tooltip-item">
          <span>{{ data.time }}</span>
          <span class="tooltip-content">{{ data.description }}</span>
        </div>
      </div>
      <input id="calendar" type="text" />
    </div>
    <div class="events_wrapper" :class="{ none: id == 0 }">
      <scroll-list v-if="events.length" class="mt-10">
        <!-- <div v-for="i in 30" :key="i + 'a'"> -->
        <div v-for="i in events" :key="i + 'a'">
          <event-item :event="i"></event-item>
        </div>
      </scroll-list>
      <scroll-list v-else class="w-full mt-10">
        <div class="empty-events-list">Super Event Comes Soon</div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUpdated } from 'vue';
import * as mobiscroll from '@mobiscroll/javascript';
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css';

const props = defineProps({
  events: { type: Array, default: () => [] },
});

const id = ref(0);
const date = ref('');
const interval = ref(null);
const customEvents = ref([]);
const tooltipData = ref([]);

const setIsShowEvents = (newId) => {
  id.value = newId;
};

const removeDuplicatedEvents = () => {
  if (props.events && props.events.length) {
    const uniqueDates = new Set(props.events.map((event) => event.started_at.substr(0, 10)));
    customEvents.value = Array.from(uniqueDates, (date) => {
      return props.events.find((event) => event.started_at.startsWith(date));
    }).map((item) => ({
      date: new Date(item.started_at),
    }));
  }
};

const addTooltip = (target, calendarRef) => {
  if (target.classList.contains('mbsc-calendar-day')) {
    const calendarWrapper = calendarRef.parentNode;
    const rect = target.getBoundingClientRect();
    const x = rect.left - calendarWrapper.getBoundingClientRect().left;
    const y = rect.top - calendarWrapper.getBoundingClientRect().top;
    const tooltip = document.querySelector('.tooltip');
    tooltip.style.display = 'block';
    tooltip.style.left = x - 102 + 'px';
    tooltip.style.top = y + 47 + 'px';
  }
};

const findEventsByDate = (dateString) => {
  const searchDate = new Date(dateString);
  const matchingEvents = props.events.filter((event) => {
    const eventDate = new Date(event.started_at);
    return (
      eventDate.getFullYear() === searchDate.getFullYear() &&
      eventDate.getMonth() === searchDate.getMonth() &&
      eventDate.getDate() === searchDate.getDate()
    );
  });
  return matchingEvents;
};

const getTooltipTime = (dateStr) => {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

onUpdated(removeDuplicatedEvents);

watch(() => props.events, removeDuplicatedEvents, { deep: true });

onMounted(() => {
  removeDuplicatedEvents();

  document.addEventListener('click', (event) => {
    const calendarWrapper = document.querySelector('.calendar_wrapper');
    const tooltip = document.querySelector('.tooltip');

    if (calendarWrapper && !calendarWrapper.contains(event.target)) {
      tooltip.style.display = 'none';
    }
  });

  mobiscroll.setOptions({
    theme: 'material',
  });

  const calendarRef = document.querySelector('#calendar');

  mobiscroll.datepicker('#calendar', {
    display: 'inline',
    controls: ['calendar'],
    touchUi: false,
    marked: customEvents.value,
    onCellClick: (event, inst) => {
      const target = event.target;
    },
    onCellHoverIn: (event, inst) => {
      const target = event.target;
      event.selected = true;
      target.classList.add('mbsc-selected');
      const eventsByDate = findEventsByDate(event.date);
      if (eventsByDate.length) {
        tooltipData.value = eventsByDate.map((item) => ({
          time: getTooltipTime(item.started_at),
          description: item.description,
        }));
        addTooltip(target, calendarRef);
      }
    },
    onCellHoverOut: (event, inst) => {
      const target = event.target;
      target.classList.remove('mbsc-selected');
      const calendarWrapper = document.querySelector('.calendar_wrapper');
      const tooltip = document.querySelector('.tooltip');
      if (calendarWrapper.contains(event.target)) {
        tooltip.style.display = 'none';
      }
    },
    onChange: (ev, inst) => {
      date.value = inst.getVal();
    },
  });
});
</script>

<style lang="scss">
.empty-events-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
  padding-left: 15px;
}
.events_wrapper {
  padding: 20px 24px;
  background: $white;
  border-radius: 16px;
  width: fit-content;
  height: fit-content;
  min-width: 360px;
  display: flex;
  border: 1px solid $default-border;
  max-height: 425px;
  &.none {
    display: none;
  }
}
.btns {
  position: absolute;
  top: 23px;
  left: 30px;
  z-index: 100;
}
.tabs_wrapper {
  position: relative;
  width: 100%;
  border-radius: 16px;
}
.margin-top {
  margin-top: 20px;
}
#calendar {
  display: none;
}
.display-none {
  display: none;
}
.calendar_wrapper {
  position: relative;
  max-width: 360px;
  border-radius: 16px;
  border: 1px solid $default-border;
  &.none {
    display: none;
  }
}
.flex {
  flex: none;
}
.tooltip {
  display: none;
  position: absolute;
  z-index: 999;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 14px;
  line-height: 1.5;
  width: 240px;
  height: auto;
  min-height: 32px;
  left: -100px;
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    top: 0;
    left: 115px;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default-border;
  }
  .tooltip-content {
    position: relative;
    z-index: 20;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $white;
    padding-left: 8px;
  }
}
</style>
