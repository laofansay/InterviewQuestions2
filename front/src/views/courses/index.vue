<template>
  <div class="courses-container p-6 max-w-7xl mx-auto">
    <!-- 搜索和筛选区域 -->
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex-1 max-w-md">
        <el-input
          v-model="searchQuery"
          placeholder="搜索课程名称或描述"
          class="w-full"
          :prefix-icon="Search"
          @input="handleSearch"
          size="large"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div class="flex items-center gap-4">
        <el-select
          v-model="sortBy"
          placeholder="排序方式"
          class="w-32"
          size="large"
        >
          <el-option label="最新" value="latest">
            <template #default="{ label }">
              <div class="flex items-center">
                <el-icon class="mr-2"><Timer /></el-icon>
                {{ label }}
              </div>
            </template>
          </el-option>
          <el-option label="最热" value="popular">
            <template #default="{ label }">
              <div class="flex items-center">
                <el-icon class="mr-2"><Star /></el-icon>
                {{ label }}
              </div>
            </template>
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 课程列表 -->
    <el-row :gutter="24" class="p-2 gap-3">
      <el-col
        v-for="course in courses"
        :key="course.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="mb-6" 
      >
        <CourseCard :course="course" @click="navigateToCourse(course.id)" />
      </el-col>
    </el-row>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <el-spinner size="large" />
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="!loading && courses.length === 0"
      description="暂无相关课程"
      :image-size="200"
    >
      <template #extra>
        <el-button type="primary" @click="fetchCourses">刷新</el-button>
      </template>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Timer, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCourses } from '@/api/course.ts'
import CourseCard from '@/components/CourseCard.vue'

const router = useRouter()
const courses = ref([])
const loading = ref(false)
const searchQuery = ref('')
const sortBy = ref('latest')

const fetchCourses = async () => {
  try {
    loading.value = true
    const response = await getCourses()
    courses.value = response
  } catch (error) {
    ElMessage.error('获取课程列表失败')
    console.error('Error fetching courses:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 实现搜索逻辑
  const query = searchQuery.value.toLowerCase()
  if (!query) {
    fetchCourses()
    return
  }
  courses.value = courses.value.filter(
    (course) =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
  )
}

const navigateToCourse = (courseId) => {
  router.push(`/courses/${courseId}`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.course-card {
  transition: all 0.3s ease;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>