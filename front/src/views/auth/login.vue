<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="w-full max-w-md px-6 transform transition-all duration-300 hover:scale-[1.02]">
      <el-card class="overflow-hidden shadow-2xl border-0">
        <template #header>
          <div class="text-center py-2">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h2>
            <p class="text-gray-600 text-sm">登录以继续您的学习之旅</p>
          </div>
        </template>
        <el-form :model="form" :rules="rules" ref="formRef" class="space-y-6">
          <el-form-item prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="请输入邮箱"
              :prefix-icon="User"
              class="hover:shadow-sm transition-shadow duration-300"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码"
              :prefix-icon="Lock"
              class="hover:shadow-sm transition-shadow duration-300"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              class="w-full h-11 text-base font-medium hover:shadow-lg transition-all duration-300" 
              @click="handleLogin" 
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="text-center mt-6 mb-2">
          <el-button 
            link 
            type="primary" 
            @click="router.push('/auth/register')"
            class="text-sm font-medium"
          >
            还没有账号？立即注册
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'
import { login } from '../../api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

import { onMounted, watch } from 'vue'

// 检查登录状态并重定向
const checkLoginStatus = () => {
  if (userStore.isLoggedIn) {
    router.push('/courses')
  }
}

onMounted(checkLoginStatus)

// 监听登录状态变化
watch(() => userStore.isLoggedIn, (newValue) => {
  if (newValue) {
    checkLoginStatus()
  }
})

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const result = await login(form)
    userStore.setToken(result.session.access_token)
    userStore.setUser(result.user)
    
    ElMessage.success('登录成功')
    // 如果有重定向地址，则跳转到重定向地址
    const redirectPath = route.query.redirect as string
    // 确保重定向路径以/开头
    const normalizedPath = redirectPath && !redirectPath.startsWith('/') ? `/${redirectPath}` : redirectPath
    router.push(normalizedPath || '/courses')
  } catch (error: any) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('登录失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}
</script>