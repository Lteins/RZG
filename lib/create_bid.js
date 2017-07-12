var async = require('async');
var keystone = require('keystone');

exports = module.exports = function create_Bidding(bidding_form){
    var product = {};

    function search_product(callback){
        var q_for_product = keystone.list('Product').model.findById(bidding_form.product_id, function(err, product_result){
            product = product_result;
            callback(err, 'Product is found');
        });
    }

    function add_bidding(feedback, callback){
        var item = keystone.list('Bidding').model({
            num: bidding_form.num,
            price: bidding_form.price,
            bidder: bidding_form.user_id,
            product: bidding_form.product_id,
        });

        item.save(function(err){
            callback(err, 'New bidding is saved');
        });
    }  
    
    function query_and_sort(feedback, callback){
        product.populateRelated('biddings', function(err){
            function comparison(a, b){
                if (a.price < b.price)
                return 1;
                if (a.price > b.price)
                return -1;
                return 0;
            }
            product.biddings.sort(comparison);
            callback(err, 'Query Completed');
        });
    }

    function bidding_list_update(feedback, callback){
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
            product_channels[bidding_form.product_id].emit('new_bidding_list', product.biddings);
            callback(err, 'done');
        });                
    }

    async.waterfall([
        search_product,
        add_bidding,
        query_and_sort, 
        bidding_list_update
    ], function (err, feedback) {
    }); 
}