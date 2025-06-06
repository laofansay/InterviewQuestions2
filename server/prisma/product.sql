-- 确保在 public schema 下操作
SET search_path TO public;

-- 创建产品表
CREATE TABLE  public.product (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL,
    sku VARCHAR,
    category_id INTEGER NOT NULL,
    brand_id INTEGER,
    description TEXT,
    cover_image VARCHAR,
    image_list JSONB,
    price DECIMAL(10,2) NOT NULL,
    market_price DECIMAL(10,2),
    stock INTEGER NOT NULL,
    unit VARCHAR,
    status INTEGER DEFAULT 1,
    origin_place VARCHAR,
    specs JSONB,
    tags VARCHAR,
    is_recommend BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品 SKU 表
CREATE TABLE  public.product_sku (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sku VARCHAR NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    attributes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- 创建属性定义表
CREATE TABLE  public.attribute_definition (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品属性表
CREATE TABLE  public.product_attribute (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    attribute_id BIGINT NOT NULL,
    value VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (attribute_id) REFERENCES attribute_definition(id)
);

-- 创建索引
CREATE INDEX  idx_product_category ON public.product(category_id);
CREATE INDEX  idx_product_brand ON public.product(brand_id);
CREATE INDEX  idx_product_sku_product ON public.product_sku(product_id);
CREATE INDEX  idx_product_attribute_product ON public.product_attribute(product_id);
CREATE INDEX  idx_product_attribute_attr ON public.product_attribute(attribute_id);

