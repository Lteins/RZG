var keystone = require('keystone');
var async = require('async');
var populateAll = require('../lib/populateAll');
exports = module.exports = function accept_bid(product){
    function check_for_storage(callback){
        var query_for_product = keystone.list('Product').model.findOne({'_id': product._id});
        query_for_product.exec(function(err, product_result){
            product = product_result;
            if (product.num > 0){
                callback(null, 'There is still storage', true);
            }else{
                //Code that terminates the trading process of this product
                callback(null, 'There is no storage', false);
            }
        });
    }

    function transaction_generation(feedback, condition, callback){
        if (condition){
            var query_for_warehouse = keystone.list('Warehouse').model.findOne({'owner': product.biddings[0].bidder});
            query_for_warehouse.exec(function(err, warehouse){
                console.log(warehouse);
                if (product.biddings[0].num > product.num){
                    //Update the number of products left
                    keystone.list('Product').model.findByIdAndUpdate(product._id, {$set:{num: 0}}, function(err, result){});
                    product_channels[product._id].emit('storage_update', 0); 
                    //save the transaction
                    var new_transaction  = {
                        trader: product.biddings[0].bidder,
                        num: product.num,
                        destination: warehouse._id,
                        price: product.biddings[0].price,
                        product: product._id                                
                    };

                    var item = keystone.list('Transaction').model(new_transaction);

                    item.save(function(err, item_result){
                        callback(null, 'transaction generated', true, true);
                    });

                    var q_for_trader = keystone.list('User').model.findOne({'_id': new_transaction.trader});
                    q_for_trader.exec(function(err,trader_result){
                        new_transaction.trader = trader_result.username;
                        product_channels[product._id].emit('new_transaction', new_transaction); 
                    });
                }else{
                    //Update the number of products left
                    keystone.list('Product').model.findByIdAndUpdate(product._id, {$set:{num: product.num - product.biddings[0].num}}, function(err, result){});
                    product_channels[product._id].emit('storage_update', product.num - product.biddings[0].num); 
                    //save the transaction
                    var new_transaction = {
                        trader: product.biddings[0].bidder,
                        num: product.biddings[0].num,
                        destination: warehouse._id,
                        price: product.biddings[0].price,
                        product: product._id                                
                    };
                    console.log(new_transaction);
                    var item = keystone.list('Transaction').model(new_transaction);

                    item.save(function(err, item_result){
                        console.log('item is saved');
                        console.log(item_result);                                   
                        callback(null, 'transaction generated', false, true);                             
                    }); 

                    var q_for_trader = keystone.list('User').model.findOne({'_id': new_transaction.trader});
                    q_for_trader.exec(function(err,trader_result){
                        new_transaction.trader = trader_result.username;
                        product_channels[product._id].emit('new_transaction', new_transaction); 
                    });                           
                }
            });

        }else{
            callback(null, feedback, false, false);
        }
    }

    function recall_bid(feedback, if_split, condition, callback){
            if (condition){
                if(if_split){
                    //------------------------
                    //split and delete
                    keystone.list('Biddings').model.findByIdAndUpdate(product.biddings[0]._id, {$set:{num: product.biddings[0].num - product.num}},function(err,bidding_result){
                        callback(err, 'bid is split', true);
                    });
                }else{
                    //------------------------
                    //delete the bidding
                    product.biddings[0].remove(function(err){
                        callback(err, 'bid is recalled', true);
                    });
                }
            }else{
                callback(null, feedback, false);
            }
    }
    

    function query_and_sort(feedback, condition, callback){
        if (condition){
            product.populateRelated('biddings', function(err){
                if (product.biddings.length > 0){
                    function comparison(a, b){
                        if (a.price < b.price)
                        return 1;
                        if (a.price > b.price)
                        return -1;
                        return 0;
                    }
                    product.biddings.sort(comparison);
                    callback(err, 'Query Completed', true);
                }else{
                    callback(err,'no bid is left', false);
                }
            });
        }else{
            callback(null, feedback, false);
        }
    }

    function query_and_sort_2(feedback, condition, callback){
        if (condition){
            product.populateRelated('biddings', function(err){
                function comparison(a, b){
                    if (a.price < b.price)
                    return 1;
                    if (a.price > b.price)
                    return -1;
                    return 0;
                }
                product.biddings.sort(comparison);
                callback(err, 'Query Completed', true);
            });
        }else{
            callback(null, feedback, false);
        }
    }            

    function bidding_list_update(feedback, condition, callback){
        if (condition){
            if (product.biddings.length > 0){
                if (product.biddings.length > 3)
                    product.biddings = product.biddings.slice(0,3);

                populateAll(product.biddings, 'bidder', 'User', function(){
                    product_channels[product._id].emit('new_bidding_list', product.biddings);
                    callback(err, 'done');
                })

                // async.waterfall(tasks, function(err, waterfall_result){
                //     product_channels[product._id].emit('new_bidding_list',product.biddings);
                //     callback(err, 'done');
                // });
            }else{
                product_channels[product._id].emit('new_bidding_list', null);
                callback(null, 'done');
            }
        }else{
           callback(null, feedback); 
        }                
    }
    console.log('Begin trading');
    async.waterfall([
        check_for_storage,
        query_and_sort,
        transaction_generation, 
        recall_bid, 
        query_and_sort_2, 
        bidding_list_update
    ], function (err, feedback) {

    });               
}