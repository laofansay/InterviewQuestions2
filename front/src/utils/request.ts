import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)

request.interceptors.response.use(
    response => response.data,
    error => {
        ElMessage.error(error.response?.data?.message || '请求失败')
        return Promise.reject(error)
    }
)

export default request