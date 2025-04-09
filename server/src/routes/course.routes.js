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
 *     Course:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: 课程ID
 *         title:
 *           type: string
 *           description: 课程标题
 *         description:
 *           type: string
 *           description: 课程描述
 *         coverUrl:
 *           type: string
 *           description: 课程封面URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         videos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Video'
 *           description: 课程视频列表
 *         progress:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CourseProgress'
 *           description: 课程进度列表
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: 获取所有课程
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取课程列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get('/', async (req, res) => {
    try {
        const { data: courses, error } = await supabase
            .from('course')
            .select(`
                *,
                video (*)
            `);

        if (error) throw error;
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: 获取指定课程
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 课程ID
 *     responses:
 *       200:
 *         description: 成功获取课程信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.get('/:id', async (req, res) => {
    try {
        const { data: course, error } = await supabase
            .from('course')
            .select(`
                *,
                video (*)
            `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!course) {
            return res.status(404).json({ error: '课程不存在' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: 创建新课程
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               coverUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: 课程创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.post('/', async (req, res) => {
    try {
        const { title, description, cover_url, videos } = req.body;
        
        // 首先创建课程
        const { data: course, error: courseError } = await supabase
            .from('course')
            .insert([{
                title,
                description,
                cover_url,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (courseError) throw courseError;

        // 如果有视频数据，创建视频记录
        if (videos && videos.length > 0) {
            const videosWithCourseId = videos.map(video => ({
                ...video,
                course_id: course.id,
                created_at: new Date().toISOString()
            }));

            const { error: videoError } = await supabase
                .from('video')
                .insert(videosWithCourseId);

            if (videoError) throw videoError;
        }

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: 更新课程信息
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 课程ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               coverUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: 课程更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 */
router.put('/:id', async (req, res) => {
    try {
        const { title, description, coverUrl } = req.body;
        const { data: course, error } = await supabase
            .from('course')  // 改为 course
            .update({ title, description, coverUrl })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!course) {
            return res.status(404).json({ error: '课程不存在' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: 删除课程
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 课程ID
 *     responses:
 *       200:
 *         description: 课程删除成功
 */
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('course')  // 改为 course
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: '课程删除成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;