<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h2>个人资料</h2>
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">
            编辑资料
          </el-button>
        </div>
      </template>

      <el-form 
        ref="formRef" 
        :model="userForm" 
        :rules="rules"
        :disabled="!isEditing"
        label-width="100px"
      >
        <el-form-item label="头像" prop="avatar">
          <el-avatar 
            :size="100" 
            :src="userForm.avatar || defaultAvatar"
            @error="handleAvatarError"
          />
          <el-upload
            v-if="isEditing"
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button type="primary" class="ml-3">更换头像</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" disabled>
            <template #append>
              <el-tag :type="userForm.email_verified ? 'success' : 'warning'" size="small">
                {{ userForm.email_verified ? '已验证' : '未验证' }}
              </el-tag>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userForm.phone">
            <template #append>
              <el-tag :type="userForm.phone_verified ? 'success' : 'warning'" size="small">
                {{ userForm.phone_verified ? '已验证' : '未验证' }}
              </el-tag>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="个人简介" prop="bio">
          <el-input 
            v-model="userForm.bio" 
            type="textarea" 
            :rows="4"
            placeholder="请输入个人简介"
          />
        </el-form-item>

        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>

      <div class="user-stats">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>学习时长</template>
              <div class="stat-value">{{ userStats.totalHours }}小时</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>完成课程</template>
              <div class="stat-value">{{ userStats.completedCourses }}个</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>学习天数</template>
              <div class="stat-value">{{ userStats.learningDays }}天</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const isEditing = ref(false)
const defaultAvatar = '/default-avatar.png'

interface UserForm {
  id: string
  username: string
  email: string
  phone: string
  avatar: string
  bio: string
  email_verified: boolean
  phone_verified: boolean
  created_at: string
  last_sign_in_at: string
}

const userForm = reactive<UserForm>({
  id: '',
  username: '',
  email: '',
  phone: '',
  avatar: '',
  bio: '',
  email_verified: false,
  phone_verified: false,
  created_at: '',
  last_sign_in_at: ''
})

const userStats = reactive({
  totalHours: 0,
  completedCourses: 0,
  learningDays: 0
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

onMounted(async () => {
  try {
    const response = await userStore.getUserProfile()
    const userData = response.data
    if (userData && userData.user) {
      userForm.id = userData.user.id
      userForm.email = userData.user.email
      userForm.phone = userData.user.phone || ''
      userForm.username = userData.user.email.split('@')[0]
      userForm.email_verified = userData.user.user_metadata?.email_verified || false
      userForm.phone_verified = userData.user.user_metadata?.phone_verified || false
      userForm.created_at = userData.user.created_at
      userForm.last_sign_in_at = userData.user.last_sign_in_at
    }
    await fetchUserStats()
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
})

const fetchUserStats = async () => {
  try {
    const stats = await userStore.getUserStats()
    Object.assign(userStats, stats)
  } catch (error) {
    ElMessage.error('获取学习统计失败')
  }
}

const handleEdit = () => {
  isEditing.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
       // await userStore.updateProfile(userForm)
        isEditing.value = false
        ElMessage.success('开发中')
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

const handleCancel = () => {
  isEditing.value = false
  const userData = userStore.getUserProfile()
 
  Object.assign(userForm, userData)
}

const handleAvatarError = () => {
  userForm.avatar = defaultAvatar
}

const handleAvatarSuccess = (response: any) => {
  userForm.avatar = response.url
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.profile-card {
  background-color: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  display: inline-block;
  vertical-align: middle;
}

.user-stats {
  margin-top: 30px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
}

.el-card :deep(.el-card__header) {
  padding: 10px 20px;
}
</style>