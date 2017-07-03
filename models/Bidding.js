var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
Bidding 竞价模型
模型基础信息

成交量: num
成交价格： price 
 * ==========================================
竞价模型包含的关系

与竞价者User的 Many - One 关系（用户模型内没有设置反向链接）: 竞价者 (bidder)
与竞价商品Product的 Many - One 关系: 交易人 (item)
 * ==========================================
 */

var Bidding = new keystone.List('Bidding',{autokey: {path: 'slug', from: 'bidder', unique: true}});

Bidding.add({

    num:{ type: Number, required: true, default:'100'},
    price: { type: Number, required: true, default: '100'},

    bidder:{ type: Types.Relationship, ref:'User', many:false},
    product:{ type: Types.Relationship, ref: 'Product', many:false},
});

Bidding.defaultColumns = 'num, price';
Bidding.register();