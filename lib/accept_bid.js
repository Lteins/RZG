var keystone = require('keystone');
var async = require('async');
var populateAll = require('../lib/populateAll');
exports = module.exports = function accept_bid(transaction){
    var product_result = {};
    var q_for_bidding = keystone.list('Bidding').model.findOne({'_id': transaction.bid_id});
    q_for_bidding.exec(function(err, bidding){
        function check_for_storage(callback){
            console.log(transaction);
            var query_for_saler = keystone.list('User').model.findOne({'_id': transaction.saler_id});
            query_for_saler.exec(function(err, saler){
                console.log(saler);
                var query_for_book = keystone.list('Book').model.findOne({'product': bidding.product, 'location': saler.my_warehouse});
                query_for_book.exec(function(err, book){
                    if (book && book.num >= bidding.num){
                        function extract(p_callback){
                            keystone.list('Book').model.findByIdAndUpdate(book._id, {$set:{num: book.num - bidding.num}}, function (err, result){
                                p_callback(null, '扣除库存');
                            });
                        }

                        function inject(p_callback){
                            console.log('Begin Inject');
                            var query_for_bidder = keystone.list('User').model.findOne({'_id': bidding.bidder});
                            query_for_bidder.exec(function(err, bidder){
                                console.log('Bidder is '+ bidder);
                                var query_for_book = keystone.list('Book').model.findOne({'product': bidding.product, 'location': bidder.my_warehouse});
                                query_for_book.exec(function(err, book){
                                    console.log('Book is' + book);
                                    if (book != null){
                                        keystone.list('Book').model.findByIdAndUpdate(book._id, {$set:{num: parseFloat(book.num) + parseFloat(bidding.num)}}, function(err, result){
                                            p_callback(null, '库存移交');
                                        });
                                    }else{

                                        var new_book = {
                                            location: bidder.my_warehouse,
                                            product: bidding.product,
                                            num: bidding.num
                                        };
                                        
                                        var item = keystone.list('Book').model(new_book);
                                        item.save(function(err, result){
                                            console.log('库存移交');
                                            p_callback(null, '库存移交');
                                        });
                                    }
                                });
                            });  
                        }

                        async.parallel([extract, inject],function(err, results){
                            callback(null, '库存移交', true);
                        });
                    }else{
                        callback(null,'库存不足',false);
                    }
                });
            });
        }

        function check_out(feedback, available, callback){
            if (available){
                var query_for_saler = keystone.list('User').model.findOne({'_id': transaction.saler_id});
                query_for_saler.exec(function(err, saler){
                    keystone.list('User').model.findByIdAndUpdate(transaction.user_id, {$set:{capital: parseFloat(saler.capital) + parseFloat(bidding.num * bidding.price)}}, function(err, result){
                        callback(null, '资金移交',true );
                    });
                });
            }else{
                callback(null, feedback, false);
            }                
        }

        function transaction_generation(feedback, available, callback){
            if (available){
                var query_for_warehouse = keystone.list('Warehouse').model.findOne({'owner': bidding.bidder});
                query_for_warehouse.exec(function(err, warehouse){   
                    //save the transaction
                    var new_transaction = {
                        trader: bidding.bidder,
                        num: bidding.num,
                        destination: warehouse._id,
                        price: bidding.price,
                        product: bidding.product,
                        saler: transaction.user_id                                
                    };


                    var item = keystone.list('Transaction').model(new_transaction);

                    item.save(function(err, item_result){
                        //update the transaction list in  bidder's user center and saler's user center
                        if(user_room[bidding.bidder]){
                            user_room[bidding.bidder].emit('new_transaction', {
                                product: product_result.name,
                                num: item_result.num,
                                price: item_result.price,
                                direction: '进货'                                    });
                        }

                        if(user_room[transaction.user_id]){
                            user_room[transaction.user_id].emit('new_transaction', {
                                product: product_result.name,
                                num: item_result.num,
                                price: item_result.price,
                                direction: '出货'                                    });
                        }

                        callback(null, 'transaction generated', true);                             
                    });                         
                });
            }else{
                callback(null, feedback, false);
            }
        }

        function recall_bid(feedback, available, callback){
            if (available){
                //delete the bidding
                bidding.remove(function(err){
                    callback(err, 'bid is recalled', true);
                });
            }else{
                callback(null, feedback, false);
            }
        }

        function query_and_sort(feedback, available, callback){
            if (available){

                var q_for_product = keystone.list('Product').model.findOne({'_id': bidding.product});
                q_for_product.exec(function(err, product){
                    product_result = product;
                    product.populateRelated('biddings', function(err){
                        function comparison(a, b){
                            if (a.price < b.price)
                            return 1;
                            if (a.price > b.price)
                            return -1;
                            return 0;
                        }
                        product.biddings.sort(comparison);
                        callback(err, 'Query Completed', true, product);
                    });
                });


            }else{
                callback(null, feedback, false, null);
            }
        }

        function list_update(feedback, available, product, callback){
            if (available){
                //Update the Bidding list in product channel
                function product_channel(p_callback){
                    if (product.biddings.length > 0){
                        if (product.biddings.length > 3)
                            product.biddings = product.biddings.slice(0,3);

                        populateAll(product.biddings, 'bidder', 'User', function(){
                            product_channels[product._id].emit('new_bidding_list', product.biddings);
                            p_callback(err, 'done');
                        })
                    }else{
                        product_channels[product._id].emit('new_bidding_list', null);
                        p_callback(null, 'done');
                    }                
                }
                //update the bidding list in bidder's user center
                function bidder_bidding_channel(p_callback){
                    if (user_room[bidding.bidder] != null){
                        var q_for_biddings = keystone.list('Bidding').model.find({'bidder': bidding.bidder});
                        q_for_biddings.exec(function(err, biddings){
                            if (biddings.length > 0){
                                populateAll(biddings, 'bidder', 'User', function(){
                                        user_room[bidding.bidder].emit('new_bidding_list', biddings);
                                        p_callback(null,'done');
                                })
                            }else{
                                    user_room[bidding.bidder].emit('new_bidding_list', null);
                                    p_callback(null,'done');
                            }                
                        });
                    }else{
                        p_callback(null, 'done');        
                    }
                }

                //update the book list in bidder's and saler's center
                function bidder_book_channel(p_callback){
                    if (user_room[bidding.bidder]){
                        var q_for_bidder = keystone.list('User').model.findOne({'_id': bidding.bidder});
                        q_for_bidder.exec(function(err, bidder){
                            var q_for_books = keystone.list('Book').model.find({'location': bidder.my_warehouse});
                            q_for_books.exec(function(err, books){
                                if (books){
                                    populateAll(books, 'product', 'Product', function(){
                                        user_room[bidder._id].emit('new_book_list', books);
                                        p_callback(null, 'done');
                                    })
                                }else{
                                    user_room[bidder._id].emit('new_book_list', null);
                                    p_callback(null, 'done');
                                }   
                            });
                        });
                    }else{
                        p_callback(null, 'done')
                    }
                } 

                function saler_book_channel(p_callback){
                    if (user_room[transaction.saler_id]){
                        console.log('Begin push to saler book channel');
                        var q_for_saler = keystone.list('User').model.findOne({'_id': transaction.saler_id});
                        q_for_saler.exec(function(err, saler){
                            var q_for_books = keystone.list('Book').model.find({'location': saler.my_warehouse});
                            q_for_books.exec(function(err, books){
                                populateAll(books, 'product', 'Product', function(){
                                    user_room[saler._id].emit('new_book_list', books);
                                    p_callback(null, 'done');
                                })   
                            });
                        });
                    }else{
                        p_callback(null, 'done');
                    }
                }
                
                async.parallel([product_channel, bidder_bidding_channel, bidder_book_channel, saler_book_channel], function(err, results){
                    callback(null, 'done');
                })
            }else{
               callback(null, feedback); 
            }                
        }

        async.waterfall([
            check_for_storage,
            check_out,
            transaction_generation, 
            recall_bid, 
            query_and_sort, 
            list_update
        ], function (err, feedback) {

        });   
    });           
}