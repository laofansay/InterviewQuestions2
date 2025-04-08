import request from '../utils/request'

export interface Course {
    id: number
    title: string
    description: string
    coverUrl: string
    price: number
    createdAt: string
    updatedAt: string
}

// Get course by ID
export function getCourseById(id: number) {
    return request<Course>({
        url: `/courses/${id}`,
        method: 'get'
    })
}

// 获取课程列表
export const getCourses = () => {
    return request({
        url: '/courses',
        method: 'get'
    })
}


// 获取课程进度
export const getCourseProgress = (courseId) => {
    return request({
        url: `/course-progress/${courseId}`,
        method: 'get'
    })
}

// 更新课程进度
export const updateCourseProgress = (courseId, data) => {
    return request({
        url: `/course-progress/${courseId}`,
        method: 'post',
        data
    })
}