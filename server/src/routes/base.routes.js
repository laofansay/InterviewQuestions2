const express = require('express');
const router = express.Router();
const baseController = require('../controllers/base.controller');
const authenticateUser = require('../middleware/auth');

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Base]
 *     description: 欢迎页面
 */
router.get('/', baseController.welcome);

/**
 * @swagger
 * /api/hello:
 *   get:
 *     tags: [Base]
 *     security:
 *       - bearerAuth: []
 *     description: 测试认证接口
 */
router.get('/hello', authenticateUser, baseController.hello);

/**
 * @swagger
 * /api/data:
 *   post:
 *     tags: [Base]
 *     description: 数据处理示例
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
router.post('/data', baseController.handleData);

module.exports = router;