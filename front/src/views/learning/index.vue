<template>
  <div class="learning-container bg-gray-100 min-h-screen">
    <div class="max-w-[1200px] mx-auto p-6">
      <!-- 返回按钮和课程标题 -->
      <div class="mb-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div class="flex items-center space-x-4">
          <el-button @click="router.back()" icon="ArrowLeft">返回课程</el-button>
          <h1 class="text-2xl font-bold text-gray-800">{{ video?.title }}</h1>
        </div>
        <div class="text-gray-500 text-sm">
          <span>观看进度：{{ Math.round(watchProgress * 100) }}%</span>
        </div>
      </div>

      <!-- 视频播放器 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <video
          ref="videoPlayer"
          class="video-js vjs-big-play-centered w-full aspect-video"
          controls
          preload="auto"
          :poster="video?.video_url"
          data-setup='{}'
        >
          <source :src="video?.video_url || 'http://vjs.zencdn.net/v/oceans.mp4'" type="video/mp4" />
          您的浏览器不支持 HTML5 视频播放。
        </video>
      </div>

      <!-- 视频信息 -->
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-4 text-gray-800">视频详情:{{ video?.title }} </h2>
        <p class="text-gray-600 mb-4">{{ video?.description }}</p>
        <p class="text-gray-600 mb-4">{{ video?.video_url }}</p>
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <span>时长：{{ formatDuration(video?.duration || 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import { getVideoById } from '@/api/video'
import {courseProgressInit } from '@/api/course-progress'
import {updateWatchHistory,watchCompleted } from '@/api/watch-history'



const route = useRoute()
const router = useRouter()
const videoPlayer = ref(null)
const player = ref(null)
const video = ref(null)
const watchProgress = ref(0)
const updateProgressTimer = ref(null)

// 格式化视频时长
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 更新观看进度
const updateProgress = (currentTime, duration) => {
  if (duration > 0) {
    watchProgress.value = currentTime 
    updateWatchHistory(route.params.videoId,route.params.courseId, watchProgress.value)
    //res.status(200).json("该课程已学完");
  }
}

onMounted(async () => {
  try {
    const { videoId,courseId } = route.params
    
    const videoData = await getVideoById(videoId)
    video.value = videoData
    await courseProgressInit(courseId,videoId)
    
    // 初始化视频播放器
    player.value = videojs(videoPlayer.value, {
      controls: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2]
    })

    // 监听播放状态变化
    player.value.on('play', () => {
      // 开始播放时启动定时器
      updateProgressTimer.value = setInterval(() => {
        const currentTime = Math.floor(player.value.currentTime())
        updateProgress(currentTime, player.value.duration())
       

      }, 5000)
    })

    player.value.on('pause', () => {
      // 暂停时清除定时器
      if (updateProgressTimer.value) {
        clearInterval(updateProgressTimer.value)
      }
    })

    // 监听播放结束事件
    player.value.on('ended', () => {
      clearInterval(updateProgressTimer.value)
      
      watchCompleted(videoId,courseId ,video.value.duration)
    })

  } catch (error) {
    console.error('Error initializing video player:', error)
    ElMessage.error('加载视频失败')
  }
})

onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
  if (updateProgressTimer.value) {
    clearInterval(updateProgressTimer.value)
  }
})
</script>

<style scoped>
.video-js {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.vjs-big-play-centered .vjs-big-play-button {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>