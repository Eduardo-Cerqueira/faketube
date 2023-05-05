<template>
  <Artplayer @get-instance="getInstance" :option="option" :style="style" />
</template>

<script>
import Artplayer from '../components/chaine/VideoPlayer.vue'

export default {
  data() {
    return {
      option: {
        url: `${import.meta.env.VITE_BACKEND_ADRESS}/video/${this.$route.params.id}`,
        poster: `${import.meta.env.VITE_BACKEND_ADRESS}/thumbnail/${this.$route.params.id}`,
        fullscreen: true,
        fullscreenWeb: true,
        muted: false
      },
      style: {
        width: '600px',
        height: '400px',
        margin: '60px auto 0'
      }
    }
  },
  components: {
    Artplayer
  },
  methods: {
    getInstance(art) {
      console.info(art)
    }
  }
}
</script>
