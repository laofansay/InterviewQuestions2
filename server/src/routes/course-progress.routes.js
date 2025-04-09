const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseProgress:
 *       type: object
 *       required:
 *         - userId
 *         - courseId
 *         - totalVideos
 *         - completedVideos
 *         - progressPercentage
 *       properties:
 *         id:
 *           type: integer
 *           description: 进度ID
 *         userId:
 *           type: integer
 *           description: 用户ID
 *         courseId:
 *           type: integer
 *           description: 课程ID
 *         totalVideos:
 *           type: integer
 *           description: 总视频数
 *         completedVideos:
 *           type: integer
 *           description: 已完成视频数
 *         lastWatchedVideoId:
 *           type: integer
 *           description: 最后观看的视频ID
 *         progressPercentage:
 *           type: number
 *           description: 总体进度百分比
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: 开始学习时间
 *         lastAccessedAt:
 *           type: string
 *           format: date-time
 *           description: 最后访问时间
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: 完成时间
 *         course:
 *           $ref: '#/components/schemas/Course'
 *         lastWatchedVideo:
 *           $ref: '#/components/schemas/Video'
 */

/**
 * @swagger
 * /api/course-progress:
 *   get:
 *     summary: 获取用户的所有课程进度
 *     tags: [CourseProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *         description: 按课程ID筛选
 *     responses:
 *       200:
 *         description: 成功获取课程进度列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseProgress'
 */
router.get('/', async (req, res) => {
    try {
        let query = supabase
            .from('course_progress')
            .select('*, course(*), lastWatchedVideo(*)')
            .eq('userId', req.user.id);

        if (req.query.courseId) {
            query = query.eq('courseId', req.query.courseId);
        }

        const { data: progress, error } = await query;

        if (error) throw error;
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/course-progress/{id}:
 *   get:
 *     summary: 获取指定课程进度
 *     tags: [CourseProgress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 进度ID
 *     responses:
 *       200:
 *         description: 成功获取课程进度信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseProgress'
 */
router.get('/:id', async (req, res) => {
    try {
        const { data: progress, error } = await supabase
            .from('course_progress')
            .select('*, course(*), lastWatchedVideo(*)')
            .eq('id', req.params.id)
            .eq('userId', req.user.id)
            .single();

        if (error) throw error;
        if (!progress) {
            return res.status(404).json({ error: '课程进度不存在' });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * 点击学习的时候，组用户初始化一条数据
 */
router.post('/init/:courseId/:videoId', async (req, res) => {
    try {
        //查询该课程下面所有 vodeo的时长
        const { courseId, videoId } = req.params;
        const totalWatchTime = 1000;
        // 检查是否已存在进度记录
        const { data: existingProgress } = await supabase
            .from('course_progress')
            .select()
            .eq('user_id', req.user.id)
            .eq('course_id', courseId)
            .single();
        console.log('==', courseId, req.user.id);
        console.log('existingProgress==', existingProgress, courseId, req.user.id);
        if (!existingProgress) {
            // 创建新记录
            const { data: newProgress, error } = await supabase
                .from('course_progress')
                .insert([{
                    user_id: req.user.id,
                    course_id: courseId,
                    total_videos_times: totalWatchTime,
                    completed_videos_times: 0,
                    progress_percentage: 0,
                    last_watched_video_id: videoId,
                    completed_at: null
                }])
                .select()
                .single();

            if (error) throw error;
            if (!newProgress) {
                return res.status(404).json({ error: '初始化观看进度失败' });
            }
            res.status(201).json(newProgress);
        } else {
            res.status(200).json("观看进度已存在");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/course-progress:
 *   post:
 *     summary: 更新课程进度
 *     tags: [CourseProgress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - totalVideos
 *               - completedVideos
 *               - progressPercentage
 *             properties:
 *               courseId:
 *                 type: integer
 *               totalVideos:
 *                 type: integer
 *               completedVideos:
 *                 type: integer
 *               lastWatchedVideoId:
 *                 type: integer
 *               progressPercentage:
 *                 type: number
 *     responses:
 *       201:
 *         description: 课程进度更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseProgress'
 */
router.post('/', async (req, res) => {
    try {
        const {
            courseId,
            totalVideos,
            completedVideos,
            lastWatchedVideoId,
            progressPercentage
        } = req.body;

        // 检查是否已存在进度记录
        const { data: existingProgress } = await supabase
            .from('course_progress')
            .select()
            .eq('userId', req.user.id)
            .eq('courseId', courseId)
            .single();

        const now = new Date().toISOString();
        let progress;

        if (existingProgress) {
            // 更新现有记录
            const updateData = {
                totalVideos,
                completedVideos,
                progressPercentage,
                lastAccessedAt: now,
                lastWatchedVideoId
            };

            // 如果所有视频都完成了，设置完成时间
            if (completedVideos === totalVideos && !existingProgress.completedAt) {
                updateData.completedAt = now;
            }

            const { data: updatedProgress, error } = await supabase
                .from('course_progress')
                .update(updateData)
                .eq('id', existingProgress.id)
                .select()
                .single();

            if (error) throw error;
            progress = updatedProgress;
        } else {
            // 创建新记录
            const { data: newProgress, error } = await supabase
                .from('course_progress')
                .insert([{
                    userId: req.user.id,
                    courseId,
                    totalVideos,
                    completedVideos,
                    lastWatchedVideoId,
                    progressPercentage,
                    startedAt: now,
                    lastAccessedAt: now,
                    completedAt: completedVideos === totalVideos ? now : null
                }])
                .select()
                .single();

            if (error) throw error;
            progress = newProgress;
        }

        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;