var keystone = require('keystone');
var async = require('async');
var populateAll = require('../../../lib/populateAll');
exports = module.exports = function (req, res) {


    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'product';

    locals.data = { 
        product: {},
    };

    //Searching for the Single Product
    view.on('init', function(next) {
    var q = keystone.list('Product').model.findOne({'slug': req.params.productslug});
        q.exec(function(err, result) {
            if(result)
            {
                async.parallel([
                    //function extracting transaction's trader information
                    function(callback){
                        result.populateRelated('ledger', function(err){
                            populateAll(result.ledger, 'trader', 'User', function(){callback(null, 'One Complete');});
                        });
                        
                    },
                    //function extracting bidding's trader information
                    function(callback){
                        result.populateRelated('biddings', function(err){
                            populateAll(result.biddings, 'bidder', 'User', function(){callback(null, 'One Complete');})
                        });
                    },
                ],
                function(err, parallel_result){
                    locals.data.product = result;
                    next(err);
                });                
            }else{
                console.log('There is no Result');
                next(err);
            }    
        });
    });
    
    view.render('product/singleproduct');
};
