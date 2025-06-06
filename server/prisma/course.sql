-- 删除现有表（注意顺序：先删除依赖表）
DROP TABLE IF EXISTS public.course_progress;
DROP TABLE IF EXISTS public.watch_history;
DROP TABLE IF EXISTS public.video;
DROP TABLE IF EXISTS public.course;
-- 创建课程表
CREATE TABLE public.course (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    cover_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建视频表
CREATE TABLE public.video (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR NOT NULL,
    video_url VARCHAR NOT NULL,
    duration INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- 创建观看历史表
CREATE TABLE public.watch_history (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    course_id BIGINT NOT NULL,
    video_id BIGINT NOT NULL,
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    FOREIGN KEY (video_id) REFERENCES video(id) ON DELETE CASCADE
);

CREATE TABLE public.UserCourseProgress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id VARCHAR NOT NULL,
  course_id INTEGER NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0, -- 用户的学习进度百分比
  completed BOOLEAN NOT NULL DEFAULT FALSE, -- 是否完成课程
  start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 学习开始时间
  last_accessed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 上次访问时间
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 记录创建时间
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE, -- 外键：用户 ID
  FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE -- 外键：课程 ID
);


-- 创建课程学习进度表
CREATE TABLE IF NOT EXISTS public.course_progress (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    total_videos_times INTEGER NOT NULL DEFAULT 0,
    completed_videos_times INTEGER NOT NULL DEFAULT 0,
    last_watched_video_id BIGINT,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (last_watched_videoId) REFERENCES video(id) ON DELETE SET NULL,
    UNIQUE(user_id, course_id)
);


-- 删除现有索引
DROP INDEX IF EXISTS idx_video_course;
DROP INDEX IF EXISTS idx_watch_history_video;
DROP INDEX IF EXISTS idx_watch_history_user;
DROP INDEX IF EXISTS idx_course_progress_last_video;
-- 创建索引
CREATE INDEX idx_video_course ON video(course_id);
CREATE INDEX idx_watch_history_video ON watch_history(video_id);
CREATE INDEX idx_watch_history_user ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_last_video ON course_progress(lastWatchedVideoId);


