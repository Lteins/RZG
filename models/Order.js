var keystone = require('keystone');
var Types = keystone.Field.Types;

var Order = new keystone.List('Order',{autokey: {path: 'slug', from: '_id', unique: true}});
Order.add({
    createdAt: { type: Date, default: Date.now() },
    total_amount: { type: Number, default: 0},
    payer:{ type: Types.Relationship, ref:'User', many:false},
    status: {type: String, default: "支付中"}
});

Order.schema.virtual('timestamp').get(function(){
    function format(num){
        if (num<10)
            return "0" + num.toString();
        else
            return num.toString();
    }
    return this.createdAt.getFullYear() + "-" + format((parseFloat(this.createdAt.getMonth()) + 1)) + "-" + format(this.createdAt.getDate()) + " " + format(this.createdAt.getHours()) + ":" + format(this.createdAt.getMinutes()) + ":" + format(this.createdAt.getSeconds());
})


Order.defaultColumns = 'createdAt, total_amount, payer';
Order.register();