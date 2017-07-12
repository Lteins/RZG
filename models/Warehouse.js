var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Warehouse 仓库模型

 * 每位会员都拥有自己的仓库

 * 仓库模型与会员模型有着One 2 One 的关系

 * 仓库模型包含每个用户的成交纪录ledger(储存了仓库-交易纪录的One - Many关系)，
 仓库模型的存货清单inventory属性包含了账目Book(储存了仓库-账目的One - Many关系)
 * ==========
 */
var Warehouse = new keystone.List('Warehouse',{autokey: {path: 'slug', from: 'owner', unique: true}});

//定义模型基本属性
Warehouse.add({
    owner: { type: Types.Relationship, ref: 'User', many: false },
    name: { type: Types.Name },
    address: {type: String}
});

//建立与账目的One - Many 关系
Warehouse.relationship({ path:'inventory', ref: 'Book', refPath: 'location'});

//建立与transaction的 One - Many 关系
Warehouse.relationship({ path: 'ledger', ref: 'Transaction', refPath: 'destination' });

//建立仓库url
Warehouse.schema.virtual('url').get(function(){
    return '/users/warehouse' + this.slug;
})


/**
 * Registration
 */
Warehouse.defaultColumns = 'owner';
Warehouse.register();
