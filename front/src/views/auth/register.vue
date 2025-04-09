<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="w-full max-w-md px-6 transform transition-all duration-300 hover:scale-[1.02]">
      <el-card class="overflow-hidden shadow-2xl border-0">
        <template #header>
          <div class="text-center py-2">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">创建账号</h2>
            <p class="text-gray-600 text-sm">加入我们，开启学习之旅</p>
          </div>
        </template>
        
        <el-form :model="form" :rules="rules" ref="formRef" class="space-y-6">
          <el-form-item prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="请输入邮箱"
              :prefix-icon="Message"
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
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="确认密码"
              :prefix-icon="Lock"
              class="hover:shadow-sm transition-shadow duration-300"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              class="w-full h-11 text-base font-medium hover:shadow-lg transition-all duration-300" 
              @click="handleRegister" 
              :loading="loading"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="text-center mt-6 mb-2">
          <router-link 
            to="/auth/login" 
            class="text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm font-medium"
          >
            已有账号？立即登录
          </router-link>
        </div>
      </el-card>
    </div>

    <el-dialog
      v-model="showActivationDialog"
      title="注册成功"
      width="400px"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="text-center py-6">
        <el-icon class="text-green-500 text-6xl mb-6"><CircleCheckFilled /></el-icon>
        <h3 class="text-xl font-bold mb-4">请查收激活邮件</h3>
        <p class="text-gray-600 mb-2">我们已向 {{ registeredEmail }} 发送了激活链接</p>
        <p class="text-gray-500 text-sm mb-4">请在24小时内完成账号激活</p>
        <el-alert
          type="warning"
          :closable="false"
          class="mx-auto max-w-sm text-sm"
        >
          <p>如果没有收到邮件，请检查垃圾邮件文件夹</p>
        </el-alert>
      </div>
      <template #footer>
        <div class="flex justify-center gap-4">
          <el-button @click="resendActivationEmail" :loading="resending">重新发送</el-button>
          <el-button type="primary" @click="goToLogin">返回登录</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Lock, CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const showActivationDialog = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ]
}

const registeredEmail = ref('')
const resending = ref(false)

const handleRegister = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const result = await register({
          email: form.email,
          password: form.password
        })
        registeredEmail.value = form.email
        showActivationDialog.value = true
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || '注册失败，请稍后重试'
        ElMessage.error(errorMessage)
      } finally {
        loading.value = false
      }
    }
  })
}

const resendActivationEmail = async () => {
  resending.value = true
  try {
    await register({
      email: registeredEmail.value,
      password: form.password
    })
    ElMessage.success('激活邮件已重新发送')
  } catch (error: any) {
    ElMessage.error('重新发送失败，请稍后重试')
  } finally {
    resending.value = false
  }
}

const goToLogin = () => {
  showActivationDialog.value = false
  router.push('/auth/login')
}
</script>