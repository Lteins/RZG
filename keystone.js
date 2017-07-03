// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
var async = require('async');
// Require keystone
var keystone = require('keystone');
var swig = require('swig');
// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

// Disable swig's bulit-in template caching, express handles it
swig.setDefaults({ cache: false });

keystone.init({
	'name': 'RZG',
	'brand': 'RZG',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'swig',
	'custom engine': swig.renderFile,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'session store': 'mongo',  
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}

keystone.start(function(){
	sio = require('socket.io')(keystone.httpServer);
	sio.on('connection', function(sio){
	  console.log('a user connected');
	  sio.on('disconnect', function(){
	    console.log('user disconnected');
	  });
	  sio.on('createBidding', function(bidding_form){
        //function handling bidding creation
        var q_for_product = keystone.list('Product').model.findById(bidding_form.product_id, function(err,product){
            function add_bidding(callback){
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
                    sio.emit('new_bidding_list', product.biddings);
                    callback(err, 'done');
                });                
            }

            async.waterfall([
                add_bidding,
                query_and_sort, 
                bidding_list_update
            ], function (err, feedback) {

            }); 
        });

	  });
	});
});
