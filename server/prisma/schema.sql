-- 确保在 public schema 下操作
SET search_path TO public;

-- 创建产品表
CREATE TABLE public.product (
    -- 表结构保持不变
);

-- 创建产品 SKU 表
CREATE TABLE public.product_sku (
    -- 表结构保持不变
);

-- 创建属性定义表
CREATE TABLE public.attribute_definition (
    -- 表结构保持不变
);

-- 创建产品属性表
CREATE TABLE public.product_attribute (
    -- 表结构保持不变
);

-- 创建索引
CREATE INDEX idx_product_category ON public.product(category_id);
CREATE INDEX idx_product_brand ON public.product(brand_id);
CREATE INDEX idx_product_sku_product ON public.product_sku(product_id);
CREATE INDEX idx_product_attribute_product ON public.product_attribute(product_id);
CREATE INDEX idx_product_attribute_attr ON public.product_attribute(attribute_id);