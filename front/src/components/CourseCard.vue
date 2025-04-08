<template>
  <el-card
    class="bg-sky-200 course-card relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl  border border-gray-100"
    :body-style="{ padding: '0' }"
    shadow="hover"
    @click="$emit('click')"
  >
    <!-- 课程封面图 -->
    <div class="relative  bg-sky-200">
        <el-image
        :src="course.cover_url || '/default-course-cover.svg'"
        class="w-full aspect-video object-cover rounded-lg"
        :alt="course.title"
        fit="cover"
      >
        <template #error>
          <div class="image-slot flex justify-center items-center h-full bg-gray-100 rounded-lg">
            <el-icon class="text-5xl text-gray-300"><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <!-- 课程进度指示器 -->
      <div v-if="course.progress !== undefined" class="absolute top-2 right-2 z-10">
        <el-progress
          type="circle"
          :percentage="Math.round(course.progress * 100)"
          :width="36"
          :stroke-width="4"
          class="progress-indicator"
        >
          <template #default="{ percentage }">
            <span class="text-xs">{{ percentage }}%</span>
          </template>
        </el-progress>
      </div>
    </div>

    <!-- 课程信息 -->
    <div class="p-1">
      <h3 class="text-xl font-bold mb-2 line-clamp-1 text-gray-800 group-hover:text-primary-600 transition-colors">
        {{ course.title }} 
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
        {{ course.description }}
      </p>
      
      <!-- 课程统计信息 -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center space-x-2 bg-gray-50/80 px-3 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">
          <el-icon class="text-primary-500"><VideoCamera /></el-icon>
          <span>{{ course.videos?.length || 0 }}个视频</span>
        </div>
        <div class="flex items-center space-x-2 bg-gray-50/80 px-3 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">
          <el-icon class="text-primary-500"><Calendar /></el-icon>
          <span>{{ formatDate(course.created_at) }}</span>
        </div>
      </div>
    </div>
    <el-button type="primary" class="w-full h-10 text-base font-medium hover:shadow-lg" @click="$emit('click')">开始学习</el-button>
  </el-card>
</template>

<script setup>

defineProps({
  course: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.course-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.progress-indicator :deep(.el-progress__text) {
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 确保图片容器保持16:9的比例 */
.aspect-video {
  aspect-ratio: 16/9;
}
</style>