var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 Product 产品模型
产品基础信息

库存数量：num, 
产品介绍：description, 
产品名字：name, 
后期可能加入产品的相关图片链接,以上信息为产品的基础信息
 * ==========================================
产品模型包含的关系

与成交记录transaction包含 One - Many 的关系
与竞标纪录bidding包含 One - Many 的关系
 * ==========
 */

var Product = new keystone.List('Product',{autokey: {path: 'slug', from: 'name', unique: true}});

Product.add({
    name:{ type: String, initial: true, required: true, unique: true, index: true, default:''},
    description: { type: String, index: true },
    num: {type:Number, index: true},
    img: {type:String},
});

Product.relationship({path: 'ledger', ref: 'Transaction', refPath:'product'});
Product.relationship({path: 'biddings', ref: 'Bidding',refPath:'product'});

Product.schema.virtual('url').get(function(){
    return '/products/' + this.slug;
})

Product.defaultColumns = 'name, description, num';
Product.register();