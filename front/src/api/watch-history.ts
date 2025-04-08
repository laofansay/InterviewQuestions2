import request from '../utils/request'

export interface WatchHistoryRecord {
    id: number
    userId: number
    courseId: number
    videoId: number
    watchedDuration: number
    totalDuration: number
    lastWatchedAt: string
    progress: number
    video: {
        id: number
        title: string
        description: string
        duration: number
    }
    created_at: string
}

// Get watch history for a video
export function getWatchHistory(videoId: number) {
    return request<WatchHistoryRecord>({
        url: `/watch-history/${videoId}`,
        method: 'get'
    })
}

// Update watch history
export interface UpdateWatchHistoryParams {
    watchedDuration: number
    totalDuration: number
}

export function updateWatchHistory(videoId, courseId, progress) {
    return request({
        url: `/watch-history`,
        method: 'post',
        data: {
            videoId: videoId,
            courseId: courseId,
            progress: progress
        }
    })
}

export function watchCompleted(videoId, courseId, progress) {
    return request({
        url: `/watch-history/completed`,
        method: 'post',
        data: {
            videoId: videoId,
            courseId: courseId,
            progress
        }
    })
}


import { useUserStore } from '../stores/user'

// Get learning history for a course
export function getLearningHistory(courseId: number) {
    const userStore = useUserStore()
    return request<WatchHistoryRecord[]>({
        url: `/watch-history?courseId=${courseId}&userId=${userStore.user?.id}  `,
        method: 'get'
    })
}