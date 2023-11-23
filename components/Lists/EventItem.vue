<template>
  <div class="item">
    <div class="info-block">
      <div class="title">{{ event.name || 'Event name' }}</div>
      <div class="time">
        {{ getTooltipTime('2023-04-10T14:10:47.000000Z') }}-{{
          getTooltipTime('2023-04-10T14:31:47.000000Z')
        }}
      </div>
      <!-- <div class="time">{{ getTooltipTime(event.started_at) }}-{{ getTooltipTime(event.ended_at) }}</div> -->
    </div>
    <div class="date">
      <span class="value">{{
        new Date(event.started_at).getDate() || new Date('2023-04-10T14:31:47.000000Z').getDate()
      }}</span>
    </div>
  </div>
</template>

<script>
import { getTooltipTime } from '@/util/helpers';
export default {
  name: 'EventItem',
  data() {
    return {
      getTooltipTime,
    };
  },
  props: {
    event: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  width: 310px;
  height: 72px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  background: $default-bg;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: $default-badge-border;
  }
  .info-block {
    text-align: left;
    flex-direction: column;
    .title {
      font-size: 16px;
      line-height: 24px;
      color: $default;
    }
    .time {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.014em;
      color: $secondary;
    }
  }
  .date {
    min-width: 48px;
    max-width: fit-content;
    height: 48px;
    padding: 4px 8px;
    background: $white;
    text-align: center;
    /* Secondary/90 */

    border: 1px solid $default-badge-border;
    border-radius: 6px;

    .value {
      font-weight: 400;
      font-size: 32px;
      line-height: 40px;
      color: $section-title;
    }
  }
}
</style>
