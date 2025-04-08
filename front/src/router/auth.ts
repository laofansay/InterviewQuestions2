import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '../stores/user'

export function setupAuthGuard(router: any) {
    router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const userStore = useUserStore()
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

        if (requiresAuth) {
            if (!userStore.isLoggedIn) {
                next({
                    path: '/auth/login',
                    query: { redirect: to.fullPath }
                })
                return
            }

            // 验证token有效性
            // const isValid = await userStore.validateToken()
            // if (!isValid) {
            //     next({
            //         path: '/auth/login',
            //         query: { redirect: to.fullPath }
            //     })
            //     return
            // }
        }
        // 如果用户已登录且尝试访问登录页，重定向到首页
        if (userStore.isLoggedIn && to.path === '/auth/login') {
            next('/courses')
            return
        }
        next()
    })
}