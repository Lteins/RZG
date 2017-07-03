var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'product';

    locals.data = { 
        product: {},
    };

    // Searching for the Single Product
    view.on('init', function(next) {
    var q = keystone.list('Product').model.findOne({'slug': req.params.productslug});
        q.exec(function(err, result) {
            if(result != null)
            {

                async.parallel([
                    //function extracting transaction's trader information
                    function(callback){
                        result.populateRelated('ledger', function(err){

                            function fill_first_result(waterfall_callback){
                                if (result.ledger.length == 1){
                                    var qq = keystone.list('User').model.findOne({'_id': result.ledger[0].trader});
                                    qq.exec(function(err, trader_result){
                                       result.ledger[0]['trader'] = trader_result;
                                       waterfall_callback(null,'Complete!'); 
                                    }) ;
                                }else{
                                    var qq = keystone.list('User').model.findOne({'_id': result.ledger[0].trader});
                                    qq.exec(function(err, trader_result){
                                       result.ledger[0]['trader'] = trader_result;
                                       waterfall_callback(null,1); 
                                    }) ;
                                }
                            };

                            function fill_result(id, waterfall_callback){
                                if (id < result.ledger.length - 1){
                                    var qq = keystone.list('User').model.findOne({'_id': result.ledger[id].trader});
                                    qq.exec(function(err, trader_result){
                                       result.ledger[id]['trader'] = trader_result;
                                       waterfall_callback(null,id+1); 
                                    }) ;       
                                }else{
                                    var qq = keystone.list('User').model.findOne({'_id': result.ledger[id].trader});
                                    qq.exec(function(err, trader_result){
                                       result.ledger[id]['trader'] = trader_result;
                                       waterfall_callback(null,'Complete'); 
                                    }) ;          
                                }
                            };

                            var tasks =  [fill_first_result];
                            for (i = 1;i<result.ledger.length;i++){
                                tasks.push(fill_result);
                            }

                            async.waterfall(tasks, function(err, waterfall_result){
                                console.log(waterfall_result);
                                callback(null,'One Complete');
                            });

                        });
                        
                    },
                    //function extracting bidding's trader information
                    function(callback){
                        result.populateRelated('biddings', function(err){
                            if (result.biddings.length > 0){
                                function comparison(a, b){
                                    if (a.price < b.price)
                                    return 1;
                                    if (a.price > b.price)
                                    return -1;
                                    return 0;
                                }
                                result.biddings.sort(comparison);

                                if (result.biddings.length > 3)
                                    result.biddings = result.biddings.slice(0,3);
                                function fill_first_result(waterfall_callback){
                                    if (result.biddings.length == 1){
                                        var qq = keystone.list('User').model.findOne({'_id': result.biddings[0].bidder});
                                        qq.exec(function(err, bidder_result){
                                           result.biddings[0]['bidder'] = bidder_result;
                                           waterfall_callback(null,'Complete!'); 
                                        }) ;
                                    }else{
                                        var qq = keystone.list('User').model.findOne({'_id': result.biddings[0].bidder});
                                        qq.exec(function(err, bidder_result){
                                           result.biddings[0]['bidder'] = bidder_result;
                                           waterfall_callback(null,1); 
                                        }) ;
                                    }
                                };

                                function fill_result(id, waterfall_callback){
                                    if (id < result.biddings.length - 1){
                                        var qq = keystone.list('User').model.findOne({'_id': result.biddings[id].bidder});
                                        qq.exec(function(err, bidder_result){
                                           result.biddings[id]['bidder'] = bidder_result;
                                           waterfall_callback(null,id+1); 
                                        }) ;       
                                    }else{
                                        var qq = keystone.list('User').model.findOne({'_id': result.biddings[id].bidder});
                                        qq.exec(function(err, bidder_result){
                                           result.biddings[id]['bidder'] = bidder_result;
                                           waterfall_callback(null,'Complete'); 
                                        }) ;          
                                    }
                                };

                            
                                var tasks =  [fill_first_result];
                                for (i = 1;i<result.biddings.length;i++){
                                    tasks.push(fill_result);
                                }
                                async.waterfall(tasks, function(err, waterfall_result){
                                    callback(null,'One Complete');
                                });
                            }else{
                                callback(null, 'One Complete');
                            }
                        });
                        
                    },
                ],
                function(err, parallel_result){
                    locals.data.product = result;
                    next(err);
                });                
            }
            else
            {
                console.log('There is no Result');
                return res.status(404).send(keystone.wrapHTMLError('Sorry, no product found! (404)'));
            }
            
            
        });
    });
    
    view.render('singleproduct');
};
