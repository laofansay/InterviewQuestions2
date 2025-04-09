Product.hasMany(ProductSku, { foreignKey: 'product_id' });
ProductSku.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductAttribute, { foreignKey: 'product_id' });
ProductAttribute.belongsTo(Product, { foreignKey: 'product_id' });
ProductAttribute.belongsTo(AttributeDefinition, { foreignKey: 'attribute_id' });
