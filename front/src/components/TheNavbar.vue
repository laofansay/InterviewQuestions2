<template>
  <el-menu
    class="w-full top-0 z-50 "
    mode="horizontal"
    :ellipsis="false"
    :router="true"
  >
    <el-menu-item index="/">
      <span class="text-xl font-bold">Trae</span>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="/courses">
      <el-icon><Reading /></el-icon>
      <span>课程列表</span>
    </el-menu-item>
    <el-menu-item index="/learning">
      <el-icon><Timer /></el-icon>
      <span>学习进度</span>
    </el-menu-item>

            <template v-if="!isLoggedIn">
      <el-menu-item index="/auth/login">
        <el-icon><User /></el-icon>
        <span>登录</span>
      </el-menu-item>
    </template>
    <el-sub-menu v-else index="user" class="user-menu">
      <template #title>
        <el-avatar :size="32" :src="userAvatar" />
      </template>
      <el-menu-item index="/profile">
        <el-icon><UserFilled /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <span>设置</span>
      </el-menu-item>
      <el-menu-item @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        <span>退出登录</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { computed } from 'vue'
import {
  Reading,
  Timer,
  User,
  UserFilled,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 将状态改为计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userAvatar = computed(() => userStore.avatar)

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
}

.flex-grow {
  flex-grow: 1;
}

.register-btn {
  margin: 8px 16px;
}

.user-menu :deep(.el-sub-menu__title) {
  height: var(--el-menu-height);
  line-height: var(--el-menu-height);
}

:deep(.el-menu--popup) {
  min-width: 140px;
}
</style>