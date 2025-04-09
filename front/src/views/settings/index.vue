<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h2>系统设置</h2>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form 
            ref="basicFormRef"
            :model="basicSettings" 
            label-width="120px"
          >
            <el-form-item label="界面语言">
              <el-select v-model="basicSettings.language">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>

            <el-form-item label="界面主题">
              <el-radio-group v-model="basicSettings.theme">
                <el-radio label="light">浅色</el-radio>
                <el-radio label="dark">深色</el-radio>
                <el-radio label="auto">跟随系统</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="字体大小">
              <el-slider 
                v-model="basicSettings.fontSize" 
                :min="12" 
                :max="20"
                :marks="{12:'小',16:'中',20:'大'}"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notification">
          <el-form 
            ref="notificationFormRef"
            :model="notificationSettings" 
            label-width="120px"
          >
            <el-form-item label="系统通知">
              <el-switch v-model="notificationSettings.systemNotification" />
            </el-form-item>

            <el-form-item label="邮件通知">
              <el-switch v-model="notificationSettings.emailNotification" />
            </el-form-item>

            <el-form-item label="课程提醒">
              <el-switch v-model="notificationSettings.courseReminder" />
            </el-form-item>

            <el-form-item label="提醒时间">
              <el-time-select
                v-model="notificationSettings.reminderTime"
                :disabled="!notificationSettings.courseReminder"
                start="08:00"
                step="00:30"
                end="22:00"
                placeholder="选择提醒时间"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="隐私设置" name="privacy">
          <el-form 
            ref="privacyFormRef"
            :model="privacySettings" 
            label-width="120px"
          >
            <el-form-item label="学习记录">
              <el-radio-group v-model="privacySettings.learningRecord">
                <el-radio label="public">公开</el-radio>
                <el-radio label="friends">仅好友可见</el-radio>
                <el-radio label="private">私密</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="个人主页">
              <el-radio-group v-model="privacySettings.profile">
                <el-radio label="public">公开</el-radio>
                <el-radio label="friends">仅好友可见</el-radio>
                <el-radio label="private">私密</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="settings-footer">
        <el-button type="primary" @click="handleSave">保存设置</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../../stores/settings'
import { ref, onMounted } from 'vue'
import { reactive } from 'vue'

const settingsStore = useSettingsStore()
const activeTab = ref('basic')

const basicSettings = reactive({
  language: 'zh-CN',
  theme: 'light',
  fontSize: 16
})

const notificationSettings = reactive({
  systemNotification: true,
  emailNotification: true,
  courseReminder: false,
  reminderTime: '09:00'
})

const privacySettings = reactive({
  learningRecord: 'friends',
  profile: 'public'
})

onMounted(async () => {
  try {
    const settings = await settingsStore.getSettings()
    Object.assign(basicSettings, settings.basic)
    Object.assign(notificationSettings, settings.notification)
    Object.assign(privacySettings, settings.privacy)
  } catch (error) {
    ElMessage.error('获取设置失败')
  }
})

const handleSave = async () => {
  try {
    await settingsStore.updateSettings({
      basic: basicSettings,
      notification: notificationSettings,
      privacy: privacySettings
    })
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('设置保存失败')
  }
}

const handleReset = async () => {
  try {
    const settings = await settingsStore.getSettings()
    Object.assign(basicSettings, settings.basic)
    Object.assign(notificationSettings, settings.notification)
    Object.assign(privacySettings, settings.privacy)
    ElMessage.success('设置已重置')
  } catch (error) {
    ElMessage.error('重置失败')
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.settings-card {
  background-color: #fff;
}

.card-header {
  margin-bottom: 20px;
}

.settings-footer {
  margin-top: 30px;
  text-align: center;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}
</style>