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
 *     WatchHistory:
 *       type: object
 *       required:
 *         - userId
 *         - videoId
 *         - progress
 *       properties:
 *         id:
 *           type: integer
 *           description: 观看历史ID
 *         userId:
 *           type: integer
 *           description: 用户ID
 *         videoId:
 *           type: integer
 *           description: 视频ID
 *         watchedAt:
 *           type: string
 *           format: date-time
 *           description: 观看时间
 *         progress:
 *           type: number
 *           description: 观看进度（百分比）
 *         completed:
 *           type: boolean
 *           description: 是否已完成观看
 *         video:
 *           $ref: '#/components/schemas/Video'
 */

/**
 * @swagger
 * /api/watch-history:
 *   get:
 *     summary: 获取用户的观看历史
 *     tags: [WatchHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: videoId
 *         schema:
 *           type: integer
 *         description: 按视频ID筛选
 *     responses:
 *       200:
 *         description: 成功获取观看历史列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WatchHistory'
 */
router.get('/', async (req, res) => {
    try {
        let query = supabase
            .from('watch_history')
            .select('*, video(*)')
            .eq('user_id', req.user.id);

        if (req.query.videoId) {
            query = query.eq('video_id', req.query.videoId);
        } else {
            if (req.query.courseId) {
                query = query.eq('course_id', req.query.courseId);
            }
        }
        const { data: histories, error } = await query.order('watched_at', { ascending: false });

        if (error) throw error;
        res.json(histories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/watch-history/{id}:
 *   get:
 *     summary: 获取指定观看历史
 *     tags: [WatchHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 观看历史ID
 *     responses:
 *       200:
 *         description: 成功获取观看历史信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchHistory'
 */
router.get('/:id', async (req, res) => {
    try {
        const { data: history, error } = await supabase
            .from('watch_history')
            .select('*, video(*)')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error) throw error;
        if (!history) {
            return res.status(404).json({ error: '观看历史不存在' });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/watch-history:
 *   post:
 *     summary: 创建或更新观看历史
 *     tags: [WatchHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - progress
 *             properties:
 *               videoId:
 *                 type: integer
 *               progress:
 *                 type: number
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: 观看历史创建/更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchHistory'
 */
router.post('/', async (req, res) => {
    try {
        const { courseId, videoId, progress, completed = false } = req.body;

        console.log('videoId==', videoId);
        // 检查是否已存在观看记录
        const { data: existingHistory } = await supabase
            .from('watch_history')
            .select()
            .eq('user_id', req.user.id)
            .eq('video_id', videoId)
            .eq('course_id', courseId)
            .single();

        let history;
        console.log('existingHistory==', existingHistory);
        if (existingHistory) {
            // 更新现有记录
            //如果观看进度小于历史观看的进度 则不更新
            if (existingHistory.completed) {
                res.status(200).json("该课程已学完");
            }
            if (progress < existingHistory.progress) {
                res.status(200).json("该进度已观看过,不更新");
            }
            const { data: updatedHistory, error } = await supabase
                .from('watch_history')
                .update({
                    progress,
                    completed,
                    watched_at: new Date().toISOString()
                })
                .eq('id', existingHistory.id)
                .select()
                .single();

            if (error) throw error;
            history = updatedHistory;
        } else {
            // 创建新记录
            const { data: newHistory, error } = await supabase
                .from('watch_history')
                .insert([{
                    user_id: req.user.id,
                    video_id: videoId,
                    course_id: courseId,
                    progress,
                    completed,
                    watched_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            history = newHistory;
        }
        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/completed/', async (req, res) => {
    try {

        const { courseId, videoId, progress, completed = true } = req.body;
        // 检查是否已存在观看记录
        const { data: existingHistory } = await supabase
            .from('watch_history')
            .select()
            .eq('user_id', req.user.id)
            .eq('video_id', videoId)
            .eq('course_id', courseId)
            .single();
        let history;
        console.log('existingHistory==', existingHistory);
        if (existingHistory) {
            // 更新现有记录
            const { data: updatedHistory, error } = await supabase
                .from('watch_history')
                .update({
                    progress,
                    completed,
                    watched_at: new Date().toISOString()
                })
                .eq('id', existingHistory.id)
                .select()
                .single();

            if (error) throw error;
            history = updatedHistory;
        } else {
            // 创建新记录
            const { data: newHistory, error } = await supabase
                .from('watch_history')
                .insert([{
                    user_id: req.user.id,
                    video_id: videoId,
                    course_id: courseId,
                    progress,
                    completed,
                    watched_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            history = newHistory;
        }

        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;