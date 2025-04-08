-- 插入基础属性定义数据
INSERT INTO public.attribute_definition (id, name, description) VALUES
(1, '颜色', '商品颜色属性'),
(2, '尺寸', '商品尺寸属性'),
(3, '材质', '商品材质属性'),
(4, '重量', '商品重量属性');

-- 重置序列，确保后续插入不会冲突
SELECT setval('public.attribute_definition_id_seq', (SELECT MAX(id) FROM public.attribute_definition));