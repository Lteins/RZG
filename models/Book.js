var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 *  记账模型
 * 一条帐包含了商品ID以及存货数量
 * 一个仓库的存货纪录由若干条账组成
 * ==========================
 */
var Book = new keystone.List('Book',{autokey: {path: 'slug', from: '_id', unique: true}});

//定义模型基本属性
Book.add({
    location: {type: Types.Relationship, ref: 'Warehouse', many:false},
    product: {type: Types.Relationship, ref: 'Product', many:false},
    num: { type: Number},
});

/**
 * Registration
 */
Book.defaultColumns = 'location, product, num';
Book.register();
