import { defineStore } from 'pinia'

interface BasicSettings {
  language: string
  theme: string
  fontSize: number
}

interface NotificationSettings {
  systemNotification: boolean
  emailNotification: boolean
  courseReminder: boolean
  reminderTime: string
}

interface PrivacySettings {
  learningRecord: string
  profile: string
}

interface Settings {
  basic: BasicSettings
  notification: NotificationSettings
  privacy: PrivacySettings
}

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    basic: {
      language: 'zh-CN',
      theme: 'light',
      fontSize: 16
    },
    notification: {
      systemNotification: true,
      emailNotification: true,
      courseReminder: false,
      reminderTime: '09:00'
    },
    privacy: {
      learningRecord: 'friends',
      profile: 'public'
    }
  }),

  actions: {
    async getSettings() {
      try {
        return this.$state
      } catch (error) {
        console.error('获取设置失败:', error)
        throw error
      }
    },

    async updateSettings(settings: Settings) {
      try {
        this.$state = settings
      } catch (error) {
        console.error('更新设置失败:', error)
        throw error
      }
    }
  }
})