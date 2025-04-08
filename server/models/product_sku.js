import { defineTable, text, integer, real, json, timestamp } from 'squabase';

export const product_sku = defineTable({
    id: integer().primary().autoIncrement(),
    product_id: integer().notNull().references(() => product.id),
    sku_code: text().notNull(),
    price: real().notNull(),
    market_price: real(),
    stock: integer().notNull(),
    specs: json(),
    image: text(),
    status: integer().default(1), // 0=下架，1=上架
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
});
