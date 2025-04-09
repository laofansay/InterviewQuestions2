import { defineTable, text, integer, boolean, json, timestamp } from 'squabase';

export const attribute_definition = defineTable({
    id: integer().primary().autoIncrement(),
    name: text().notNull(),
    input_type: integer().notNull(), // 1=文本，2=下拉，3=多选
    value_list: json(),
    is_sku: boolean().default(false),
    is_required: boolean().default(false),
    sort_order: integer().default(0),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
});
