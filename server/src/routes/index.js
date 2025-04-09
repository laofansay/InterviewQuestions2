const express = require('express');
const router = express.Router();

// 导入所有路由
const productRouter = require('./product');
const attributeRouter = require('./attribute');
const categoryRouter = require('./category');
const skuRouter = require('./sku');

// API 路由注册
router.use('/products', productRouter);
router.use('/attributes', attributeRouter);
router.use('/categories', categoryRouter);
router.use('/skus', skuRouter);

module.exports = router;