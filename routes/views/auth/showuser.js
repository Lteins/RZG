var keystone = require('keystone');
var populateAll = require('../../../lib/populateAll')
var async = require('async');
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
            async.parallel([load_transaction, load_book],function(err, results){
                next();
            })

            function load_transaction(pcallback){
                warehouse_result.populateRelated('ledger', function(err){
                    if (warehouse_result.ledger.length > 0){
                        var transactions = [];
                        populateAll(warehouse_result.ledger,'product', 'Product', function(){
                            populateAll(warehouse_result.ledger, 'saler', 'User', function(){
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
                                        num: warehouse_result.ledger[i].num,
                                        saler: warehouse_result.ledger[i].saler
                                    });

                                }
                                res.locals.data['ledger'] = transactions;
                                
                                pcallback(null, 'Ledger Retrieve');  
                            });
                        });
                    }else{
                         pcallback(null, 'Ledger Retrieve'); 
                    }
                });
            }

            function load_book(pcallback){
                warehouse_result.populateRelated('inventory', function(err){
                    if (warehouse_result.inventory.length > 0){
                        var books = [];
                        populateAll(warehouse_result.inventory,'product', 'Product', function(){
                            for (var i=0;i<warehouse_result.inventory.length;i++){
                                books.push({
                                    product: warehouse_result.inventory[i].product.name,
                                    num: warehouse_result.inventory[i].num
                                });

                            }
                            res.locals.data['inventory'] = books;        
                            pcallback(null, 'Inventory Retrieve');       
                        });
                    }else{
                        pcallback(null, 'Inventory Retrieve'); 
                    }
                });
            }


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