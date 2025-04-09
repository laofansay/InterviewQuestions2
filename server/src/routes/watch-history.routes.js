const express = require('express');
const router = express.Router();
const watchHistoryController = require('../controllers/watch-history.controller');
const authenticateUser = require('../middleware/auth');

/**
 * @swagger
 * /api/watch-history:
 *   get:
 *     tags: [Watch History]
 *     security:
 *       - bearerAuth: []
 *     description: Get user's watch history
 */
router.get('/', authenticateUser, watchHistoryController.getHistory);

/**
 * @swagger
 * /api/watch-history:
 *   post:
 *     tags: [Watch History]
 *     security:
 *       - bearerAuth: []
 *     description: Add or update watch history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               video_id:
 *                 type: string
 *               progress:
 *                 type: number
 */
router.post('/', authenticateUser, watchHistoryController.addHistory);

module.exports = router;