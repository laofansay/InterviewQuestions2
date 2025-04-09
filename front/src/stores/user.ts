import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    stats: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    avatar: (state) => {
      if (!state.user) return ''
      return state.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.user.email}`
    }
  },
  actions: {
    async validateToken() {
      if (!this.token) {
        this.logout()
        return false
      }
      try {
        const user= await request.get('/auth/validate')
        if (user) {
          //this.setUser(data.user)
          return true
        }
        this.logout()
        return false
      } catch (error) {
        //this.logout()
        return true
      }
    },
    setUser(user: any) {
      this.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    setToken(token: string | null) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    logout() {
      this.setToken(null)
      this.setUser(null)
      ElMessage.success('退出登录成功')
    },
    async getUserProfile() {
      try {
        const user = await request.get('/auth/user')
        if (user) {
          this.setUser(user)
        }
      return user
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    async getUserStats() {
      // 由于当前接口没有返回统计数据，可以先返回默认值
      return {
        totalHours: 0,
        completedCourses: 0,
        learningDays: 0
      }
    }
  }
})
