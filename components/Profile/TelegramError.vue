<template>
  <ProfileModal @close="$emit('close')">
    <div class="title">Ooops !</div>
    <div class="info">
      This Telegram account has been disconnected. <br />Please try {{ diffTime }} later.
    </div>
  </ProfileModal>
</template>
<script setup>
const props = defineProps({
  time: {
    type: String,
    delault: '',
  },
});

const now = ref(new Date());

const endDate = new Date(props.time);

const diffTime = computed(() => {
  const diffMilliseconds = endDate.getTime() - now.value.getTime();
  if (diffMilliseconds < 0) {
    return;
  }
  const diffSeconds = diffMilliseconds / 1000;
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);

  const hoursText = hours === 1 ? 'hour' : 'hours';
  const minutesText = minutes === 1 ? 'minute' : 'minutes';

  return `${hours} ${hoursText} ${minutes} ${minutesText}`;
});

setInterval(() => {
  now.value = new Date();
}, 60000);
</script>
<style scoped lang="scss">
.title {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 40px;
  color: $section-title;
  text-align: center;
}
.info {
  color: $section-title;
  text-align: center;
  font-family: 'Basis Grotesque Pro';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.168px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  margin-bottom: 36px;
}
</style>
