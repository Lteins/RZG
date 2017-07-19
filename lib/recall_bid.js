var keystone = require('keystone');
var async = require('async');
var populateAll = require('../lib/populateAll');
exports = module.exports = function accept_bid(bid_id){
    var q_for_bid = keystone.list('Bidding').model.findOne({'_id': bid_id});
    q_for_bid.exec(function(err, bidding){
        if (bidding != null){
                function recall_bid(callback){
                    //delete the bidding
                    bidding.remove(function(err){
                        callback(null, 'Bid is canceled');
                    });
                }

                function check_out(callback){
                    var query_for_bidder = keystone.list('User').model.findOne({'_id': bidding.bidder});
                    query_for_bidder.exec(function(err, bidder){   
                        keystone.list('User').model.findByIdAndUpdate(bidder._id, {$set:{capital: parseFloat(bidder.capital) + parseFloat(bidding.num * bidding.price)}}, function (err, result){
                            callback(err, 'Bill is put back');
                        });
                    });  
                }
                
                function bidding_list_update(callback){
                    function product_channel(p_callback){
                        // Update the bidding_list of the product channel
                        var q_for_product = keystone.list('Product').model.findOne({'_id': bidding.product});
                        q_for_product.exec(function(err, product){
                            product.populateRelated('biddings',function(err){
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
                            })
                        });
                    }

                    function bidder_channel(p_callback){
                        var q_for_biddings = keystone.list('Bidding').model.find({'bidder': bidding.bidder});
                        q_for_biddings.exec(function(err, biddings){
                            if (biddings.length > 0){
                                populateAll(biddings, 'bidder', 'User', function(){

                                    if (user_room[bidding.bidder] != null){
                                        user_room[bidding.bidder].emit('new_bidding_list', biddings);
                                        p_callback(null,'done');
                                    }
                                })
                            }else{
                                if (user_room[bidding.bidder] != null){
                                    user_room[bidding.bidder].emit('new_bidding_list', null);
                                    p_callback(null,'done');
                                }                                
                            }                
                        });
                    }
                    
                    async.parallel([product_channel, bidder_channel], function(err, results){
                        callback(null, 'bidding list update');
                    });
                }
    

                async.series([check_out, recall_bid, bidding_list_update], function(err, feedback){});
            
        }else{
            console.log("Bidding does not exist");
        }   
    }) ;
}