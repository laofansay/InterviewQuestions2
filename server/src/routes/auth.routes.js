const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     description: 用户注册
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     description: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     tags: [Auth]
 *     description: 获取用户信息
 *     security:
 *       - bearerAuth: []
 */
router.get('/user', authController.getUser);

module.exports = router;