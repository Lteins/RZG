var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res){
    if (req.user){
        return res.redirect('/');
    }

    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = "createaccount";
    locals.form = req.body;

    if (req.headers['referer'] && (locals.data == undefined || locals.data.prepage == undefined))
        locals.data = {prepage: req.headers['referer']};

    view.on('post', function(next){
        async.series([
            function(cb){
                if (!req.body.username||!req.body.firstname||!req.body.lastname||!req.body.email||!req.body.password){
                    req.flash('error', '请输入你的用户名');
                    return cb(true)
                }
                return cb();
            },

            function(cb){
                keystone.list('User').model.findOne({username: req.body.username}, 
                    function(err, user){
                        if (err || user){
                            req.flash('error', '用户已经存在');
                            return cb(true);
                        }
                        return cb();
                    });
            },

            function(cb){
                keystone.list('User').model.findOne({email: req.body.email}, 
                    function(err, user){
                        if (err || user){
                            req.flash('error', '该邮箱已被使用');
                            return cb(true);
                        }
                        return cb();
                    });
            },

            function(cb){
                keystone.list('User').model.findOne({phone: req.body.phone}, 
                    function(err, user){
                        if (err || user){
                            req.flash('error', '该手机号码已被使用');
                            return cb(true);
                        }
                        return cb();
                    });
            },

            function(cb){

                var userData = {
                    username: req.body.username,
                    name: {
                        first: req.body.firstname,
                        last: req.body.lastname,
                    },
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                };

                var User = keystone.list('User').model;
                newUser = new User(userData);
                newUser.save(function(err, newUser_result){
                    var warehouseData = {
                        owner: newUser_result._id,
                        name: {
                            first: newUser_result.username + "'s",
                            last: 'Warehouse'
                        },
                    };
                    var Warehouse = keystone.list('Warehouse').model;
                    newWarehouse = new Warehouse(warehouseData);
                    newWarehouse.save(function(err, warehouse_result){
                        keystone.list('User').model.findByIdAndUpdate(newUser_result._id, {$set:{my_warehouse: warehouse_result._id}}, function(err, result){
                            return cb();
                        });
                    });
                });
            }
        ], function(err){
            if (err) {
                locals.data['prepage'] = req.body.prepage;
                return next();
            };
            
            var onSuccess = function(){
                res.redirect(req.body.prepage);
            }

            var onFail = function(e){
                req.flash('error', '登录出现问题，请稍后再试')
                return next();
            }

            keystone.session.signin({email: req.body.email, password: req.body.password}, req, res, onSuccess, onFail);
        });
    });

    view.render('auth/join');
}