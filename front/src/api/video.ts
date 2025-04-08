import request from '../utils/request'

// 获取视频详情
export const getVideoById = (videoId) => {
    return request({
        url: `/videos/${videoId}`,
        method: 'get'
    })
}



