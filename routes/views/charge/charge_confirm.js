var keystone = require('keystone');
var sign = require('../../../lib/sign')
exports = module.exports = function(req, res) { 
    //console.log("out_trade_no is" + req.body['out_trade_no']);
    var view = new keystone.View(req, res);
    view.on('post', function(next) {
        console.log("out_trade_no is" + req.body['out_trade_no']);
        var order_id = req.body['out_trade_no'];
        var query_for_order = keystone.list('Order').model.findOne({"_id": order_id});
        query_for_order.exec(function(err, order_result){
            if(order_result){
                var query_for_payer = keystone.list('Order').model.findOne({"_id": order_result.payer})
                query_for_payer.exec(function(err, payer_result){
                    if(payer_result){
                        keystone.list('User').model.findByIdAndUpdate(payer_result._id, {$set: {'capital': parseFloat(payer_result.capital) + parseFloat(order_result.total_amount)}}, function(err, user_update){
                            keystone.list('Order').model.findByIdAndUpdate(order_result._id, {$set: {'status': '已支付'}}, function(err, order_update){
                                next();
                            })
                        })
                    }else{
                        next();
                    }
                });
            }else{
                next();
            }
        })

    });

    // Render the view
    view.render('index');
};