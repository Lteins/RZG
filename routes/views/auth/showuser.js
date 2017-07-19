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
            async.parallel([load_transaction, load_book, load_bidding],function(err, results){
                next();
            })

            function load_transaction(pcallback){
                warehouse_result.populateRelated('ledger', function(err){
                    if (warehouse_result.ledger.length > 0){
                        var transactions = [];
                        populateAll(warehouse_result.ledger,'product', 'Product', function(){
                                for (var i=0;i<warehouse_result.ledger.length;i++){

                                    transactions.push({
                                        product: warehouse_result.ledger[i].product.name,
                                        price: warehouse_result.ledger[i].price,
                                        num: warehouse_result.ledger[i].num,
                                        direction: ((req.user._id == warehouse_result.ledger[i].saler) ? '出货' : '进货')
                                    });

                                }
                                res.locals.data['ledger'] = transactions;
                                
                                pcallback(null, 'Ledger Retrieve');  
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

            function load_bidding(pcallback){
                var q_for_biddings = keystone.list('Bidding').model.find({'bidder': req.user._id});
                q_for_biddings.exec(function(err, biddings){
                    if (biddings.length > 0){
                        populateAll(biddings, 'product', 'Product', function(){
                            res.locals.data['biddings'] = biddings;
                            pcallback(null, 'Biddings Retrieve');
                        });
                    }else{
                        pcallback(null, 'Biddings Retrieve');
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