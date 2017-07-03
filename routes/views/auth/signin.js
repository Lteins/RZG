var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res){
    if (req.user){
        return res.redirect('/showuser');
    }

    var view = new keystone.View(req,res),
        locals = res.locals;

    locals.section = 'signin';

    view.on('post', function(next){
        if (!req.body.email||!req.body.password){
            req.flash('error', 'Please enter your email and password.');
            return next();
        }

        var onSuccess = function(){
            res.redirect('/showuser');
        };

        var onFail = function(){
            req.flash('error', 'Something Wrong. Please try again later');
        };

        keystone.session.signin({email: req.body.email, password: req.body.password}, req, res, onSuccess, onFail);
    });

    view.render('auth/signin');
}