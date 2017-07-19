/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	
	res.locals.user = req.user;
	res.locals.navLinks = [
		{ label: '主页', key: 'home', href: 'http://www.crongkj.com/' },
		{ label: '信息公告', key: 'info', href: 'http://www.crongkj.com/' },
		{ label: '联系我们', key: 'contact', href: 'http://www.crongkj.com/' },
	];

	if (req.originalUrl.indexOf('.png')>-1 || req.originalUrl.indexOf('.jpg')>-1){
		return res.redirect(req.originalUrl.slice(req.originalUrl.lastIndexOf('/')));
	}else{
	next();
	}
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	console.log('flash Message is '+ flashMessages.info + " " + flashMessages.success + " "+ flashMessages.error);
	var temp = req.flash('ram');
	if (temp[0] != undefined)
	res.locals.data['prepage'] = temp[0];
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;

	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
