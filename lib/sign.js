var crypto = require('crypto');
var fs = require('fs');



var business_content ={
    out_trade_no: "20150320010101001",
    product_code: "FAST_INSTANT_TRADE_PAY",
    subject: "Recharge",
    total_amount: 0.01 
};

var default_parameter = {
    app_id: "2017071807795260",
    biz_content: "{}",
    charset: "GBK",
    return_url: "http://www.crongkj.com:3000/show_user",
    notify_url: "http://www.crongkj.com:3000/charge_confirm",
    method: "alipay.trade.page.pay",
    passback_params: "user_id",
    sign_type: "RSA2",
    timestamp: "2017-10-05 10:31:51",
    version: "1.0"
};

function getVerifyParams(params) {
    var sPara = [];
    if(!params) return null;
    for(var key in params) {
        if((!params[key]) || key == "sign") {
            continue;
        };
        sPara.push([key, params[key]]);
    }
    sPara = sPara.sort();
    var prestr = '';
    for(var i2 = 0; i2 < sPara.length; i2++) {
        var obj = sPara[i2];
        if(i2 == sPara.length - 1) {
            prestr = prestr + obj[0] + '=' + obj[1] + '';
        } else {
            prestr = prestr + obj[0] + '=' + obj[1] + '&';
        }
    }
    return prestr;
}

function veriySign(params) {
    try {
        var publicPem = fs.readFileSync('./rsa_public_key.pem');
        var publicKey = publicPem.toString();
        var prestr = getVerifyParams(params);
        var sign = params['sign'] ? params['sign'] : "";
        var verify = crypto.createVerify('RSA-SHA1');
        verify.update(prestr);
        return verify.verify(publicKey, sign, 'base64')

    } catch(err) {
        console.log('veriSign err', err)
    }
}

exports = module.exports = function(user_id, total_amount, order_id, time_stamp){
    //Get data
    var privatePem = fs.readFileSync('./server.pem');
    business_content.total_amount = parseFloat(total_amount);
    business_content.out_trade_no = order_id.toString();
    default_parameter.passback_params = user_id.toString();
    default_parameter.biz_content = JSON.stringify(business_content);
    default_parameter.timestamp = time_stamp;
    var data = getVerifyParams(default_parameter);
   
   //Produce Sign
    var key = privatePem.toString();
    var sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    console.log(data);
    var signature = sign.sign(key, 'base64');
    return signature;
}

// var privatePem = fs.readFileSync('server.pem');
// var key = privatePem.toString();
// var sign = crypto.createSign('RSA-SHA256');
// sign.update('abc');
// var signature = sign.sign(key, 'base64');
// console.log(signature);




