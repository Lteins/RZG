var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res){
    if (req.user){
        return res.redirect('/showuser');
    }

    var view = new keystone.View(req,res),
        locals = res.locals;

    locals.section = 'signin';

    if (req.headers['referer'] && (locals.data == undefined || locals.data.prepage == undefined))
        locals.data = {prepage: req.headers['referer']};

    view.on('post', function(next){
        if (!req.body.email||!req.body.password){
            req.flash('error', 'Please enter your email and password.');
            return next();
        }

        var onSuccess = function(){
            console.log(req.body.prepage);
            res.redirect(req.body.prepage);
        };

        var onFail = function(){
            req.flash('error', '用户名或者密码不正确');
            req.flash('ram', req.body.prepage);
            res.redirect('/signin');
        };
        keystone.session.signin({email: req.body.email, password: req.body.password}, req, res, onSuccess, onFail);
    });

    view.render('auth/signin');
}