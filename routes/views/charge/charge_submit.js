var keystone = require('keystone');
var sign = require('../../../lib/sign')
exports = module.exports = function(req, res) { 
    console.log('RECEIVE');
    var view = new keystone.View(req, res);
    var locals = res.locals;

    if (!req.user){
        return res.redirect('/signin');
    }

    locals.data = {};

    view.on('post', function(next) {
        var order_data = {
            payer: req.user._id,
            total_amount: req.body.total_amount
        };
        var new_order = keystone.list('Order').model(order_data);
        new_order.save(function(err, order_result){
            console.log(order_result.timestamp);
            var signature = sign(order_result.payer, order_result.total_amount, order_result._id, order_result.timestamp, req.body.mode);
            locals.data['app_id'] = "2017071807795260";
            var business_content ={
                out_trade_no: "20150320010101001",
                product_code: "FAST_INSTANT_TRADE_PAY",
                subject: "Recharge",
                total_amount: 0.01 
            };
            business_content.total_amount = parseFloat(order_result.total_amount);
            business_content.out_trade_no = order_result._id.toString();
            locals.data['biz_content'] = JSON.stringify(business_content);
            locals.data['return_url'] = "http://www.crongkj.com:3000/showuser";
            locals.data['notify_url'] = "http://www.crongkj.com:3000/charge_confirm";
            locals.data['charset'] = "UTF-8";

            locals.data['method'] = (req.body.mode == 'PC')?"alipay.trade.page.pay":"alipay.trade.wap.pay";
            locals.data['sign_type'] = "RSA2";
            locals.data['timestamp'] = order_result.timestamp;
            locals.data['version'] = "1.0"
            locals.data['passback_params'] = order_result.payer.toString();
            locals.data['sign'] = signature.toString();
            next();
        });         
    });
    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'charge'; 

    // Render the view
    view.render('charge/charge_submit');
};