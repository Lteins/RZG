var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
Transaction 成交纪录模型
模型基础信息

成交量: num
成交价格： price 
 * ==========================================
 交易模型包含的关系

与仓库Warehouse的 Many - One 关系：交易后商品目的地 （destination）
与交易者User的 Many - One 关系（用户模型内没有设置反向链接）: 交易人 (trader)
与交易商品Product的 Many - One 关系: 交易人 (product)
 * ==========================================
 */

var Transaction = new keystone.List('Transaction',{autokey: {path: 'slug', from: 'trader', unique: true}});

Transaction.add({

    num:{ type: Number, required: true, default:'100'},
    price: { type: Number, required: true, default: '100'},
    destination:{ type: Types.Relationship, ref:'Warehouse', many:false},
    trader:{ type: Types.Relationship, ref:'User', many:false},
    saler:{type: Types.Relationship, ref: 'User', many:false},
    product:{ type: Types.Relationship, ref: 'Product', many:false}
});

Transaction.defaultColumns = 'num, price, product';
Transaction.register();