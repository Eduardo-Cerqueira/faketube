<template>
  <main>
    <div  class="w-full overflow-x-hidden">
      <div><img src="../assets/ppCarre.jpg" alt="" class="w-full h-32" /></div>
      <InfoChannel
        videoChannelName="toto"
        VideoNumber="3"
        SubscriberNumber="5"
        videoDescription="ma super chaine"
      ></InfoChannel>

      <!-- <H2 class="ml-4 m-auto" >nos vidéos</H2> -->

      <!-- composant video -->
    
      <div class="grid gap-10 grid-cols-4 mt-10">
        <!-- v-if="!isFetching" -->
        <div v-for="video in userVideos" :key="video.id">
          <SelectVideoChannelFetch :video="video"></SelectVideoChannelFetch>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { useFetch } from '@vueuse/core'
import { computed, onMounted, ref, reactive } from 'vue'
// import SelectVideoChannel from "../components/chaine/SelectVideoChannel.vue";
import SelectVideoChannelDynamic from '../components/chaine/SelectVideoChannelDynamic.vue'
import SelectVideoChannelFetch from '../components/chaine/SelectVideoChannelFetch.vue'
import InfoChannel from '../components/chaine/InfoChannel.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const userVideos = ref('')

onMounted(async () => {
  const userId = route.params.id

  const {
    isFetching,
    error,
    data: videos
  } = await useFetch(`http://localhost:8080/getVideoByPublisherId/${userId}`)
  userVideos.value = JSON.parse(videos.value).message
})
</script>
