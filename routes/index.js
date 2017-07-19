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
    //app.get('/warehouse/:warehouseslug', routes.views.warehouse.showWarehouse);
    
    app.all('/showuser', routes.views.auth.warehouse);

    //显示某个商品页面
    app.all('/products/:productslug', routes.views.product.singleproduct);
    app.all('/wholesale/:productslug', routes.views.product.wholesale);

    //显示充值页面
    app.get('/charge', routes.views.charge.charge);
    app.all('/charge_submit', routes.views.charge.charge_submit);
    app.all('/charge_confirm', routes.views.charge.charge_confirm);
    //app.get('/warehouse', routes.views.auth.warehouse);

    //app.get('/recharge', routes.views.recharge);
    //对每个现有商品开始交易
    // var q_for_products = keystone.list('Product').model.find();
    // q_for_products.exec(function(err, products_result){
    //     for(var i = 0;i<products_result.length;i++){
    //         setInterval(require('../lib/accept_bid'), 5000, products_result[i]);
    //     }
    // });
};
