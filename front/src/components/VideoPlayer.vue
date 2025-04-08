<template>
  <div class="w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
    <video
      ref="video"
      class="w-full aspect-video"
      :src="src"
      controls
      @loadedmetadata="onLoaded"
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
}>()

const video = ref<HTMLVideoElement | null>(null)

const onLoaded = () => {
  console.log('Video loaded:', props.src)
}
</script>

<style scoped>
/* 可选：增加对 Video 的一些覆盖样式 */
video::-webkit-media-controls {
  display: block;
}
</style>
