import { defineTable, text, integer, real, boolean, json, timestamp } from 'squabase';

export const product = defineTable({
    id: integer().primary().autoIncrement(),
    name: text().notNull(),
    sku: text(),
    category_id: integer().notNull(),
    brand_id: integer(),
    description: text(),
    cover_image: text(),
    image_list: json(),
    price: real().notNull(),
    market_price: real(),
    stock: integer().notNull(),
    unit: text(),
    status: integer().default(1), // 0=下架，1=上架
    origin_place: text(),
    specs: json(),
    tags: text(),
    is_recommend: boolean().default(false),
    sort_order: integer().default(0),
    deleted: boolean().default(false),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
});
