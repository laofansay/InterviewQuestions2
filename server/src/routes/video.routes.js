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
 *     Video:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *         - videoUrl
 *         - duration
 *         - order
 *       properties:
 *         id:
 *           type: integer
 *           description: 视频ID
 *         courseId:
 *           type: integer
 *           description: 所属课程ID
 *         title:
 *           type: string
 *           description: 视频标题
 *         videoUrl:
 *           type: string
 *           description: 视频URL
 *         duration:
 *           type: number
 *           description: 视频时长（秒）
 *         order:
 *           type: integer
 *           description: 视频排序
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         course:
 *           $ref: '#/components/schemas/Course'
 *         histories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WatchHistory'
 *           description: 观看历史记录
 */

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: 获取所有视频
 *     tags: [Videos]
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
 *         description: 成功获取视频列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 */
router.get('/', async (req, res) => {
    try {
        let query = supabase.from('video').select('*, course(*), watch_history(*))');

        if (req.query.courseId) {
            query = query.eq('courseId', req.query.courseId);
        }

        const { data: videos, error } = await query.order('order', { ascending: true });

        if (error) throw error;
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: 获取指定视频
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 视频ID
 *     responses:
 *       200:
 *         description: 成功获取视频信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 */
router.get('/:id', async (req, res) => {
    try {
        const { data: video, error } = await supabase
            .from('video')
            .select('*, course(*)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!video) {
            return res.status(404).json({ error: '视频不存在' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: 创建新视频
 *     tags: [Videos]
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
 *               - title
 *               - videoUrl
 *               - duration
 *               - order
 *             properties:
 *               courseId:
 *                 type: integer
 *               title:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 视频创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 */
router.post('/', async (req, res) => {
    try {
        const { courseId, title, videoUrl, duration, order } = req.body;
        const { data: video, error } = await supabase
            .from('videos')
            .insert([{
                courseId,
                title,
                videoUrl,
                duration,
                order,
                createdAt: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: 更新视频信息
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 视频ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 视频更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, videoUrl, duration, order } = req.body;
        const { data: video, error } = await supabase
            .from('videos')
            .update({ title, videoUrl, duration, order })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!video) {
            return res.status(404).json({ error: '视频不存在' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: 删除视频
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 视频ID
 *     responses:
 *       200:
 *         description: 视频删除成功
 */
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: '视频删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;