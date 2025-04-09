<template>
  <div class="home-container">
    <!-- 顶部横幅 -->
    <div class="banner bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">欢迎来到面试题库</h1>
        <p class="text-xl mb-8">提升技能，助力职业发展</p>
        <el-button type="primary" size="large" @click="startLearning">开始学习</el-button>
      </div>
    </div>

    <!-- 特色功能区 -->
    <div class="features py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">平台特色</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="feature in features" :key="feature.title">
            <el-card class="feature-card h-full">
              <div class="text-center">
                <el-icon :size="40" class="text-blue-500 mb-4">
                  <component :is="feature.icon" />
                </el-icon>
                <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
                <p class="text-gray-600">{{ feature.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 最新题目展示 -->
    <div class="recent-questions py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">最新题目</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="question in recentQuestions" :key="question.id">
            <el-card class="question-card mb-4 cursor-pointer hover:shadow-lg transition-shadow"
              @click="goToQuestion(question.id)">
              <h4 class="text-lg font-bold mb-2">{{ question.title }}</h4>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ question.description }}</p>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>难度: {{ question.difficulty }}</span>
                <span>{{ question.category }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Reading, DataLine } from '@element-plus/icons-vue'

const router = useRouter()

const features = [
  {
    icon: 'Document',
    title: '丰富题库',
    description: '涵盖前端、后端、算法等多个领域的精选面试题'
  },
  {
    icon: 'Reading',
    title: '详细解析',
    description: '每道题目都配有详细的解答和知识点讲解'
  },
  {
    icon: 'DataLine',
    title: '学习追踪',
    description: '记录学习进度，掌握知识点分布'
  }
]

const recentQuestions = ref([
  {
    id: 1,
    title: 'Vue3 组合式 API 的优势',
    description: '请详细说明 Vue3 组合式 API (Composition API) 相比于选项式 API 的主要优势和使用场景。',
    difficulty: '中等',
    category: 'Vue.js'
  },
  {
    id: 2,
    title: 'React Hooks 原理',
    description: '解释 React Hooks 的工作原理，以及为什么不能在条件语句中使用 Hooks。',
    difficulty: '困难',
    category: 'React'
  },
  {
    id: 3,
    title: '微前端架构设计',
    description: '讨论微前端的实现方案，以及在实际项目中的应用考虑。',
    difficulty: '困难',
    category: '架构'
  }
])

const startLearning = () => {
  router.push('/questions')
}

const goToQuestion = (id: number) => {
  router.push(`/question/${id}`)
}
</script>

<style scoped>
.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.question-card {
  height: 100%;
}
</style>
