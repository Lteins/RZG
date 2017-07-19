var async = require('async');
var keystone = require('keystone');
var populateAll = require('../lib/populateAll');
exports = module.exports = function create_Bidding(bidding_form){
    var product = {};

    function search_product(callback){
        var q_for_product = keystone.list('Product').model.findById(bidding_form.product_id, function(err, product_result){
            product = product_result;
            callback(err, 'Product is found');
        });
    }

    function check_out(feedback, callback){
        var query_for_bidder = keystone.list('User').model.findOne({'_id': bidding_form.user_id});
        query_for_bidder.exec(function(err, bidder){
            if (bidding_form.num * bidding_form.price <= bidder.capital){
                keystone.list('User').model.findByIdAndUpdate(bidder._id, {$set:{capital: parseFloat(bidder.capital) - parseFloat(bidding_form.num * bidding_form.price)}}, function (err, result){
                    callback(err, 'Bill is payed', true);
                });
            }else{
                callback(err, 'Not affordable', false);
            };
        });  
    }

    function add_bidding(feedback, affordable, callback){
        if (affordable){
            var item = keystone.list('Bidding').model({
                num: bidding_form.num,
                price: bidding_form.price,
                bidder: bidding_form.user_id,
                product: bidding_form.product_id,
            });

            item.save(function(err){
                callback(err, 'New bidding is saved', true);
            });
        }else{
            callback(null, feedback, false);
        }
    }  
    
    function query_and_sort(feedback, condition, callback){
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
            function product_channel(p_callback){
                // Update the bidding_list of the product channel
                if (product.biddings.length > 0){
                    if (product.biddings.length > 3)
                        product.biddings = product.biddings.slice(0,3);

                    populateAll(product.biddings, 'bidder', 'User', function(){
                        product_channels[product._id].emit('new_bidding_list', product.biddings);
                        p_callback(null, 'done');
                    })
                }else{
                    product_channels[product._id].emit('new_bidding_list', null);
                    p_callback(null, 'done');
                }
            }

            function bidder_channel(p_callback){
                var q_for_bidding = keystone.list('Bidding').model.find({'bidder': bidding_form.user_id});
                q_for_bidding.exec(function(err, biddings){
                    if (biddings.length > 0){
                        populateAll(biddings, 'bidder', 'User', function(){
                            if (user_room[bidding_form.user_id] != null){
                                user_room[bidding_form.user_id].emit('new_bidding_list', biddings);
                                p_callback(null,'done');
                            }
                        })
                    }else{
                        if (user_room[bidding_form.user_id] != null){
                            user_room[bidding_form.user_id].emit('new_bidding_list', null);
                            p_callback(null,'done');
                        }    
                    }                
                });
            }

            async.parallel([product_channel, bidder_channel], function(err, results){
                callback(null, 'bidding list update');
            });
        }else{
            callback(null, feedback);
        }                
    }

    async.waterfall([
        search_product,
        check_out,
        add_bidding,
        query_and_sort, 
        bidding_list_update
    ], function (err, feedback) {
    }); 
}