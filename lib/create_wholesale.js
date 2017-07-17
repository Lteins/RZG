var async = require('async');
var keystone = require('keystone');

exports = module.exports = function create_wholesale(wholesale_form, req, next, locals){
    var product = {};

    function check_for_storage(callback){
        var query_for_product = keystone.list('Product').model.findOne({'_id': wholesale_form.product_id});
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

    function check_out(feedback, condition, callback){
        if (condition){
            var query_for_saler = keystone.list('User').model.findOne({'_id': wholesale_form.user_id});
            query_for_saler.exec(function(err, saler){
                if (wholesale_form.num * product.price <= saler.capital){
                    keystone.list('User').model.findByIdAndUpdate(saler._id, {$set:{capital: saler.capital - wholesale_form.num * product.price}}, function (err, result){
                        callback(err, 'Bill is payed', true, true);
                    });
                }else{
                    callback(err, 'Not affordable', true, false);
                };
            });  
        }else{
            callback(null, feedback, false, false);
        };
    }

    function transaction_generation(feedback, available, affordable, callback){
        if (available){
            if (affordable){
                var query_for_warehouse = keystone.list('Warehouse').model.findOne({'owner': wholesale_form.user_id});
                query_for_warehouse.exec(function(err, warehouse){
                    if (wholesale_form.num > product.num){

                        //Update the number of products left
                        keystone.list('Product').model.findByIdAndUpdate(product._id, {$set:{num: 0}}, function(err, result){
                            locals.data.product.num = 0;
                            product_channels[product._id].emit('storage_update', 0); 
                            //save the transaction
                            var new_transaction  = {
                                saler: "594f52b202e377054592bdbc",
                                trader: wholesale_form.user_id,
                                num: product.num,
                                destination: warehouse._id,
                                price: product.price,
                                product: product._id                                
                            };
                            var item = keystone.list('Transaction').model(new_transaction);
                            item.save(function(err, item_result){
                                var q_for_book = keystone.list('Book').model.findOne({product: wholesale_form.product_id, location: warehouse._id});
                                
                                q_for_book.exec(function(err, book_result){
                                    if(book_result){
                                        keystone.list('Book').model.findByIdAndUpdate(book_result._id, {$set:{num: parseFloat(book_result.num) + parseFloat(product.num)}}, function (err, book_update_result){
                                            callback(null, 'transaction_generated');
                                        });
                                    }else{
                                        var new_book = {
                                            location: warehouse._id,
                                            product: wholesale_form.product_id,
                                            num: product.num
                                        };
                                        var item2  = keystone.list('Book').model(new_book);
                                        item2.save(function(err, item2_result){
                                            callback(null, 'transaction_generated');
                                        });
                                    }
                                });
                            });  

                        });
                    }else{

                        //Update the number of products left
                        keystone.list('Product').model.findByIdAndUpdate(product._id, {$set:{num: product.num - wholesale_form.num}}, function(err, result){
                        
                            locals.data.product.num = product.num - wholesale_form.num;
                           
                            product_channels[product._id].emit('storage_update', product.num - wholesale_form.num);
                            //save the transaction
                            var new_transaction = {
                                trader: wholesale_form.user_id,
                                saler: "594f52b202e377054592bdbc",
                                num: wholesale_form.num,
                                destination: warehouse._id,
                                price: product.price,
                                product: product._id                                
                            };

                            var item = keystone.list('Transaction').model(new_transaction);
                            item.save(function(err, item_result){
                                var q_for_book = keystone.list('Book').model.findOne({product: wholesale_form.product_id, location: warehouse._id});
                                
                                q_for_book.exec(function(err, book_result){
                                    if(book_result){
                                        keystone.list('Book').model.findByIdAndUpdate(book_result._id, {$set:{num: parseFloat(book_result.num) + parseFloat(wholesale_form.num)}}, function (err, book_update_result){
                                            callback(null, 'transaction_generated');
                                        });
                                    }else{
                                        var new_book = {
                                            location: warehouse._id,
                                            product: wholesale_form.product_id,
                                            num: wholesale_form.num
                                        };
                                        var item2  = keystone.list('Book').model(new_book);
                                        item2.save(function(err, item2_result){
                                            callback(null, 'transaction_generated');
                                        });
                                    }
                                });
                            });  
                        }); 
                        
                    }
                });
            }else{
                callback(null, feedback);
            }
        }else{

            callback(null, feedback);
        }
    }

    async.waterfall([
        check_for_storage,
        check_out,
        transaction_generation
    ], function (err, feedback) {
        if (feedback == 'transaction generated'){
            req.flash('info', '购买成功');
            return next();
        }else{
            req.flash('err', feedback);
            return next();
        }
    }); 
}