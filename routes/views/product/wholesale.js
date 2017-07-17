var keystone = require('keystone');
var async = require('async');
var populateAll = require('../../../lib/populateAll');
var create_wholesale = require('../../../lib/create_wholesale');
exports = module.exports = function (req, res) {


    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'wholesale';

    locals.data = { 
        product: {},
    };

    //Searching for the Single Product
    view.on('init', function(next) {
    var q = keystone.list('Product').model.findOne({'slug': req.params.productslug});
        q.exec(function(err, result) {
            if(result)
            {
                locals.data.product = result;
                next(err);               
            }else{
                console.log('There is no Result');
                next(err);
            }    
        });
    });

    view.on('post', function(next) {
        create_wholesale(req.body, req, next, locals);
    });
    
    view.render('product/wholesale');
};
