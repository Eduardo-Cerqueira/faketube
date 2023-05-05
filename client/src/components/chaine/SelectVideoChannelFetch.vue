<script setup>
import { computed, ref, watch } from 'vue'
import * as dayjs from 'dayjs'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const formattedVideoDate = computed(() => {
  const videoDateFormatted = dayjs(props.video.created_at)
  const now = dayjs()
  const diff = now.diff(videoDateFormatted, 'second')

  if (diff >= 31536000) {
    return `${Math.floor(diff / 31536000)} years`
  } else if (diff >= 2592000) {
    return `${Math.floor(diff / 2592000)} months`
  } else if (diff >= 604800) {
    return `${Math.floor(diff / 604800)} weeks`
  } else if (diff >= 86400) {
    return `${Math.floor(diff / 86400)} days`
  } else if (diff >= 3600) {
    return `${Math.floor(diff / 3600)} hours`
  } else if (diff >= 60) {
    return `${Math.floor(diff / 60)} minutes`
  } else {
    return `${diff} seconds`
  }
})
</script>
<template>
  <div class="text-white max-h-25 w-full">
    <router-link :to="{name: 'watch', params: {id: video.id}}">
    <img
      class="w-full aspect-video object-cover rounded-2xl"
      :src="`${path}/thumbnail/${video.id}`"
      :alt="video.title"
    />
    <div class="1/4 gap-4 mt-2 shadow-sm ">
      <div></div>
      <div class="video__info flex flex-col">
        <span class="font-bold text-10 mt-2">{{ video.title }}</span>
        <span class="text-zinc-500 text-xs">{{ video.views }} views - {{ formattedVideoDate }} ago</span>
      </div>
    </div>
  </router-link>
  </div>
</template>
