import { defineTable, text, integer, timestamp } from 'squabase';

export const product_attribute = defineTable({
    id: integer().primary().autoIncrement(),
    product_id: integer().notNull().references(() => product.id),
    attribute_id: integer().notNull().references(() => attribute_definition.id),
    value: text().notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow()
});
