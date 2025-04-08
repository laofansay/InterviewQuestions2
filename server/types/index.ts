// 更新 Course 接口，添加进度关联
export interface Course {
    id: number;
    title: string;
    description?: string;
    cover_url?: string;
    created_at: Date;
    videos?: Video[];
    progress?: CourseProgress[];  // 添加进度关联
}

export interface Video {
    id: number;
    course_id: number;
    title: string;
    video_url: string;
    duration: number;
    order: number;
    created_at: Date;
    course?: Course;
    histories?: WatchHistory[];
}

export interface WatchHistory {
    id: number;
    user_id: number;
    course_id: number;
    video_id: number;
    watched_at: Date;
    progress: number;
    completed: boolean;
    video?: Video;
}

export interface CourseProgress {
    id: number;
    user_id: number;
    course_id: number;
    total_videos_times: number;
    completed_videos_times: number;
    last_watched_video_id?: number;
    progress_percentage: number;
    started_at: Date;
    last_accessed_at: Date;
    completed_at?: Date;
    course?: Course;
    last_watched_video?: Video;
}