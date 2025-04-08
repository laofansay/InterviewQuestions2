import { Present } from '@element-plus/icons-vue'
import request from '../utils/request'

// 获取视频详情
export const getCourseProgressId = (videoId) => {
    return request({
        url: `/course-progress/${videoId}`,
        method: 'get'
    })
}

// 更新视频观看进度
export const courseProgressInit = (courseId, videoId) => {
    return request({
        url: `/course-progress/init/${courseId}/${videoId}`,
        method: 'post'
    })
}

// 播放烤完居
export const courseProgressCompleted = (videoId) => {
    return request({
        url: `/course-progress/completed/${videoId}`,
        method: 'post'
    })
}

