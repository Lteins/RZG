var keystone = require('keystone');
var async = require('async');
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res);
    var locals = res.locals;

    if (!req.user){
        return res.redirect('/signin');
    }

    locals.data = {};

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'charge'; 

    // Render the view
    view.render('charge/charge');
};