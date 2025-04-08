<template>
  <div class="course-detail-container p-6 bg-white rounded-2xl shadow-lg" v-loading="loading" element-loading-text="加载中...">
    <template v-if="loading">
      <div class="h-[200px]"></div>
    </template>

    <template v-else>
      <div class="mb-8">
        <el-breadcrumb class="mb-6">
          <el-breadcrumb-item :to="{ path: '/courses' }">
            课程列表
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ course.title }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="flex flex-wrap md:flex-nowrap gap-8 bg-gradient-to-br from-sky-50 to-white p-6 rounded-xl shadow-sm gap-4">
          
          <div class="w-[300px] h-[200px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <img
              :src="course.cover_url || '/default-course-cover.jpg'"
              class="max-w-full max-h-full object-contain"
              :alt="course.title"
            />
          </div>


          <div class="flex-1 space-y-4 p-3">
            <h1 class="text-3xl font-bold text-gray-800">{{ course.title }}</h1>
            <p class="text-gray-600 text-lg leading-relaxed">{{ course.description }}</p>
            <div class="flex items-center text-sm text-gray-500 space-x-6">
              <div class="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <el-icon class="text-primary-500"><Calendar /></el-icon>
                <span>创建时间：{{ formatDate(course.created_at) }}</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <el-icon class="text-primary-500"><VideoCamera /></el-icon>
                <span>{{ course.videos?.length || 0 }} 个视频</span>
              </div>
            </div>
            <el-progress
              :percentage="courseProgress"
              :format="progressFormat"
              class="mt-6 progress-bar"
              :stroke-width="12"
            />
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="course-tabs bg-white rounded-xl p-6 shadow-sm">
        <el-tab-pane label="课程内容" name="content">
          <div class="video-list">
            <el-collapse v-model="activeVideos">
              <el-collapse-item
                v-for="video in course.video"
                :key="video.id"
                :title="`${video.title} (${formatDuration(video.duration)})`"
                :name="video.id"
              >
              
                <div class="flex items-center justify-between p-4">
                  <div class="flex-1">
                    <p class="text-gray-600 mb-2">{{ video.description }} </p>
                    <span class="text-sm text-gray-500">
                      时长：{{ formatDuration(video.duration) }}
                    </span>
                    <span class="text-sm text-gray-500">
                      上次学到：{{ formatDuration(video.duration) }}
                    </span>
                  </div>
                  <el-button
                    type="primary"
                    @click="startLearning(video.id)"
                  >
                    开始学习
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <el-tab-pane label="学习进度" name="history">
          <div class="learning-history">
            <el-timeline>
              <el-timeline-item
                v-for="record in learningHistory"
                :key="record.id"
                :timestamp="formatDate(record.watched_at)"
                placement="top"
              >
                <div class="history-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-lg">{{ record.video.title }}</h4>
                    <el-tag
                      :type="record.completed ? 'success' : 'info'"
                      size="small"
                      class="ml-2"
                    >
                      {{ record.completed ? '已完成' : '学习中' }}
                    </el-tag>
                  </div>
                
                  <span class="text-sm text-gray-500">
                      时长：{{ formatDuration(record.video.duration) }}
                    </span>
                    <p class="text-gray-600">
                    上次学到：{{ formatDuration(record.progress) }}  学习进度：{{ Math.round(record.progress * 100) }}% 
                  </p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCourseById } from '@/api/course.ts'
import { getLearningHistory } from '@/api/watch-history.ts'

const route = useRoute()
const router = useRouter()
const course = ref({})
const loading = ref(false)
const activeTab = ref('content')
const activeVideos = ref([])
const learningHistory = ref([])

const courseProgress = computed(() => {
  if (!course.value.videos?.length) return 0
  const completedVideos = learningHistory.value.filter(
    (record) => record.progress >= 0.9
  ).length
  return Math.round((completedVideos / course.value.videos.length) * 100)
})

const progressFormat = (percentage) => {
  return `完成度 ${percentage}%`
}

const fetchCourseData = async () => {
  try {
    loading.value = true
    const courseId = route.params.id
    const [courseData, historyData] = await Promise.all([
      getCourseById(courseId),
      getLearningHistory(courseId)
    ])
    course.value = courseData
    learningHistory.value = historyData
  } catch (error) {
    ElMessage.error('获取课程信息失败')
    console.error('Error fetching course data:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startLearning = (videoId) => {
  router.push(`/learning/${course.value.id}/${videoId}`)
}

onMounted(() => {
  fetchCourseData()
})
</script>

<style scoped>
.course-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

.video-list {
  margin-top: 20px;
}

.history-item {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.el-progress-bar__outer) {
  border-radius: 9999px;
  background-color: #e2e8f0;
}

:deep(.el-progress-bar__inner) {
  border-radius: 9999px;
  transition: all 0.3s ease;
}

:deep(.el-collapse-item__header) {
  font-size: 1.125rem;
  font-weight: 500;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 4px;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

:deep(.el-collapse-item__header:hover) {
  background-color: #f1f5f9;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}
</style>