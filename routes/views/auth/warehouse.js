var keystone = require('keystone');
var asyn = require('async');
var populateAll = require('../../../lib/populateAll')
exports = module.exports = function (req, res) {
    if (!req.user){
        return res.redirect('/signin');
    }
    
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'warehouse';

    locals.data = {};

    view.on('init', function(next) {
        var q_for_warehouse = keystone.list('Warehouse').model.findOne({'owner': req.user._id});
        q_for_warehouse.exec(function(err, warehouse_result){
            warehouse_result.populateRelated('ledger', function(err){

                if (warehouse_result.ledger.length > 0){
                    var transactions = [];

                    populateAll(warehouse_result.ledger,'product', 'Product', function(){
                        for (var i=0;i<warehouse_result.ledger.length;i++){
                            transactions.push({
                                product: warehouse_result.ledger[i].product.name,
                                status: warehouse_result.ledger[i].status,
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

    view.render('auth/warehouse');
}