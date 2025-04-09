const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 获取产品列表
 *     description: 获取所有未删除的产品列表，包含SKU和属性信息
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   product_sku:
 *                     type: array
 *                     items:
 *                       type: object
 *                   product_attribute:
 *                     type: array
 *                     items:
 *                       type: object
 *       500:
 *         description: 服务器错误
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product')
      .select(`
        *,
        product_sku (
          id,
          sku,
          price,
          stock
        ),
        product_attribute (
          id,
          value,
          attribute_definition (
            id,
            name,
            description
          )
        )
      `)
      .eq('deleted', false)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 创建新产品
 *     description: 创建一个新的产品，包含基本信息、SKU和属性
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               stock:
 *                 type: integer
 *               unit:
 *                 type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *               skus:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: 产品创建成功
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器错误
 */
router.post('/', async (req, res) => {
  const {
    name,
    description,
    price,
    category_id,
    stock,
    unit,
    attributes,
    skus
  } = req.body;

  try {
    // 验证必要字段
    if (!name || !price || !category_id) {
      return res.status(400).json({
        error: '名称、价格和分类为必填项'
      });
    }

    // 创建产品基本信息
    const { data: product, error: productError } = await supabase
      .from('product')
      .insert({
        name,
        description: description || '',
        category_id,
        price: parseFloat(price),
        stock: stock || 0,
        unit: unit || '件',
        status: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (productError) throw productError;

    // 创建 SKU
    if (skus && skus.length > 0) {
      const productSkus = skus.map(sku => ({
        product_id: product.id,
        sku: sku.sku,
        price: parseFloat(sku.price),
        stock: parseInt(sku.stock),
        attributes: sku.attributes
      }));

      const { error: skuError } = await supabase
        .from('product_sku')
        .insert(productSkus);

      if (skuError) throw skuError;
    }

    // 创建产品属性
    if (attributes && attributes.length > 0) {
      const productAttributes = attributes.map(attr => ({
        product_id: product.id,
        attribute_id: parseInt(attr.attribute_id),
        value: attr.value
      }));

      const { error: attrError } = await supabase
        .from('product_attribute')
        .insert(productAttributes);

      if (attrError) throw attrError;
    }

    // 获取完整的产品信息（包含关联数据）
    const { data: fullProduct, error: fetchError } = await supabase
      .from('product')
      .select(`
        *,
        product_sku (
          id,
          sku,
          price,
          stock
        ),
        product_attribute (
          id,
          value,
          attribute_definition (
            id,
            name,
            description
          )
        )
      `)
      .eq('id', product.id)
      .single();

    if (fetchError) throw fetchError;

    res.status(201).json({
      message: '产品创建成功',
      product: fullProduct,
      success: true
    });
  } catch (error) {
    console.error('创建产品失败:', error);
    res.status(500).json({
      error: '创建产品失败',
      message: error.message,
      success: false
    });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: 获取单个产品详情
 *     description: 通过产品ID获取产品的详细信息
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 产品ID
 *     responses:
 *       200:
 *         description: 成功获取产品详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 product_attribute:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: 产品不存在
 *       500:
 *         description: 服务器错误
 */
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product')
      .select(`
        *,
        product_attribute (
          id,
          value,
          attribute_definition (
            name,
            description
          )
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: '产品不存在' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 创建新产品
 *     description: 创建一个新的产品，包含基本信息、SKU和属性
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               stock:
 *                 type: integer
 *               unit:
 *                 type: string
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *               skus:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: 产品创建成功
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器错误
 */
router.post('/', async (req, res) => {
  const { name, description, price, attributes } = req.body;

  try {
    console.log('开始创建产品，请求数据:', req.body);

    // 验证必要字段
    if (!name || !price) {
      return res.status(400).json({
        error: '名称和价格为必填项'
      });
    }

    // 创建产品
    const { data: product, error: productError } = await supabase
      .from('product')
      .insert({
        name,
        description: description || '',
        price: parseFloat(price),
        category_id: 1,  // 添加必填字段
        stock: 100,      // 添加必填字段
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    console.log('产品创建结果:', { product, error: productError });

    if (productError) {
      console.error('创建产品失败:', productError);
      throw productError;
    }

    // 如果有属性，添加产品属性
    if (attributes && attributes.length > 0) {
      console.log('开始创建产品属性:', attributes);

      const productAttributes = attributes.map(attr => ({
        product_id: product.id,
        attribute_id: parseInt(attr.attribute_id),
        value: attr.value
      }));

      const { data: attrData, error: attrError } = await supabase
        .from('product_attributes')  // 注意：这里改成你的实际表名
        .insert(productAttributes)
        .select();

      if (attrError) {
        console.error('创建产品属性失败:', attrError);
        // 如果属性创建失败，删除已创建的产品
        await supabase
          .from('products')
          .delete()
          .eq('id', product.id);
        throw attrError;
      }

      console.log('属性创建成功:', attrData);
    }

    res.status(201).json({
      message: '产品创建成功',
      product,
      success: true
    });
  } catch (error) {
    // 打印完整的错误对象
    console.error('创建产品失败:', {
      name: error.name,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      stack: error.stack,
      error: error
    });

    // 返回更详细的错误信息
    res.status(500).json({
      error: '创建产品失败',
      details: {
        name: error.name,
        code: error.code,
        message: error.message,
        hint: error.hint,
        details: error.details
      },
      success: false
    });
  }
});

// 更新产品
router.put('/:id', async (req, res) => {
  const { name, description, price, attributes } = req.body;

  try {
    // 更新产品基本信息
    const { data: product, error: productError } = await supabase
      .from('product')
      .update({ name, description, price })
      .eq('id', req.params.id)
      .select()
      .single();

    if (productError) throw productError;

    // 如果有属性更新
    if (attributes && attributes.length > 0) {
      // 先删除旧的属性
      await supabase
        .from('product_attribute')
        .delete()
        .eq('product_id', req.params.id);

      // 添加新的属性
      const productAttributes = attributes.map(attr => ({
        product_id: req.params.id,
        attribute_id: attr.attribute_id,
        value: attr.value
      }));

      const { error: attrError } = await supabase
        .from('product_attribute')
        .insert(productAttributes);

      if (attrError) throw attrError;
    }

    res.json({
      message: '产品更新成功',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除产品
router.delete('/:id', async (req, res) => {
  try {
    // 先删除产品属性
    await supabase
      .from('product_attribute')
      .delete()
      .eq('product_id', req.params.id);

    // 删除产品
    const { error } = await supabase
      .from('product')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: '产品删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;