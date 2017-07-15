var keystone = require('keystone');
var populateAll = require('../../../lib/populateAll')
var asyn = require('async');
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;

    if (!req.user){
        return res.redirect('/signin');
    }

    locals.data = {};

    view.on('init', function(next) {
        var q_for_warehouse = keystone.list('Warehouse').model.findOne({'owner': req.user._id});
        q_for_warehouse.exec(function(err, warehouse_result){
            warehouse_result.populateRelated('ledger', function(err){

                if (warehouse_result.ledger.length > 0){
                    var transactions = [];

                    populateAll(warehouse_result.ledger,'product', 'Product', function(){

                        for (var i=0;i<warehouse_result.ledger.length;i++){
                            function translate(status){
                                if (status == 'accept')
                                    return '已受理';
                                if (status == 'send');
                                    return '已发送';
                            }
                            transactions.push({
                                product: warehouse_result.ledger[i].product.name,
                                status: translate(warehouse_result.ledger[i].status),
                                price: warehouse_result.ledger[i].price,
                                num: warehouse_result.ledger[i].num
                            });

                        }
                        res.locals.data['ledger'] = transactions;
                        console.log('locals.data is  '+ transactions);
                        next();       
                    });
                }else{
                    next();
                }
            });
        });
    });
    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'center'; 
    locals.data = { 
        user: req.user,
    }; 
    // Render the view
    view.render('auth/showuser');
};