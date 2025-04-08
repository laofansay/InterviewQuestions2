import request from '../utils/request'

export interface LoginParams {
    email: string
    password: string
}

export interface LoginResult {
    token: string
    user: {
        id: number
        email: string
        name: string
        avatar?: string
    }
}

// 登录
export function login(data: LoginParams) {
    return request<LoginResult>({
        url: '/auth/login',
        method: 'post',
        data
    })
}

// 退出登录
export function logout() {
    return request({
        url: '/auth/logout',
        method: 'post'
    })
}