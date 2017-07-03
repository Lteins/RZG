/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var async = require('async');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);

    //administration system
    //注册请求
    app.all('/join',routes.views.auth.join);
    //登录请求
    app.all('/signin', routes.views.auth.signin);
    //登出请求
    app.get('/signout', routes.views.auth.signout);
    //进入用户中心请求
    app.get('/showuser', routes.views.auth.showuser);

    //显示某个商品页面
    app.all('/products/:productslug', routes.views.product.singleproduct);

    //对每个现有商品开始交易
    var q_for_products = keystone.list('Product').model.find();
    q_for_products.exec(function(err, products_result){
        function accept_bid(product){
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
                            sio.emit('storage_update', 0); 
                            //save the transaction
                            var new_transaction  = {
                                trader: product.biddings[0].bidder,
                                num: product.num,
                                destination: warehouse._id,
                                price: product.biddings[0].price,
                                product: product._id                                
                            };

                            var item = keystone.list('Transaction').model({new_transation});

                            item.save(function(err){
                                callback(null, 'transaction generated', true, true);
                            });

                            sio.emit('new_transaction', new_transaction); 
                        }else{
                            //Update the number of products left
                            keystone.list('Product').model.findByIdAndUpdate(product._id, {$set:{num: product.num - product.biddings[0].num}}, function(err, result){});
                            sio.emit('storage_update', product.num - product.biddings[0].num); 
                            //save the transaction
                            var new_transaction = {
                                trader: product.biddings[0].bidder,
                                num: product.num,
                                destination: warehouse._id,
                                price: product.biddings[0].price,
                                product: product._id                                
                            };
                            console.log(new_transaction);
                            var item = keystone.list('Transaction').model({new_transaction});

                            item.save(function(err){
                                callback(null, 'transaction generated', false, true);
                            }); 

                            sio.emit('new_transaction', new_transaction);                            
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
                        callback(err, feedback, false);
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

            function bidding_list_update(feedback, condition, callback){
                if (condition){
                    if (product.biddings.length > 0){
                        if (product.biddings.length > 3)
                            product.biddings = product.biddings.slice(0,3);

                        function fill_first_result(waterfall_callback){
                            if (product.biddings.length == 1){
                                var qq = keystone.list('User').model.findOne({'_id': product.biddings[0].bidder});
                                qq.exec(function(err, bidder_result){    
                                   product.biddings[0]['bidder'] = bidder_result;
                                   waterfall_callback(null,'Complete!'); 
                                }) ;
                            }else{
                                var qq = keystone.list('User').model.findOne({'_id': product.biddings[0].bidder});
                                qq.exec(function(err, bidder_result){
                                   product.biddings[0].bidder = bidder_result;
                                   waterfall_callback(null,1); 
                                }) ;
                            }
                        };

                        function fill_result(id, waterfall_callback){
                            if (id < product.biddings.length - 1){
                                var qq = keystone.list('User').model.findOne({'_id': product.biddings[id].bidder});
                                qq.exec(function(err, bidder_result){
                                   product.biddings[id]['bidder'] = bidder_result;
                                   waterfall_callback(null,id+1); 
                                }) ;       
                            }else{
                                var qq = keystone.list('User').model.findOne({'_id': product.biddings[id].bidder});
                                qq.exec(function(err, bidder_result){
                                   product.biddings[id]['bidder'] = bidder_result;
                                   waterfall_callback(null,'Complete'); 
                                }) ;          
                            }
                        };

                        var tasks =  [fill_first_result];

                        for (i = 1;i<product.biddings.length;i++){
                            tasks.push(fill_result);
                        }

                        async.waterfall(tasks, function(err, waterfall_result){
                            sio.emit('new_bidding_list',product.biddings);
                            callback(err, 'done');
                        });
                    }else{
                        sio.emit('new_bidding_list', null);
                        callback(err, 'done');
                    }
                }else{
                   callback(err, feedback); 
                }                
            }

            async.waterfall([
                check_for_storage,
                query_and_sort,
                transaction_generation, 
                recall_bid, 
                query_and_sort, 
                bidding_list_update
            ], function (err, feedback) {

            }); 
                       
        }

        for(var i = 0;i<products_result.length;i++){
            //setInterval(accept_bid, 5000, products_result[i]);
        }
    });
};
