//该函数负责处理socket.io的响应

var keystone = require('keystone');
var async = require('async');
var create_bid = require('./create_bid');
var accept_bid = require('./accept_bid');
var recall_bid =  require('./recall_bid');
exports = module.exports = function socket_binding(){
     sio = require('socket.io')(keystone.httpServer);

      var q_for_products = keystone.list('Product').model.find();
      q_for_products.exec(function(err,products_result){
        if(products_result !=null){
            product_channels = {};
            for(var i=0; i<products_result.length;i++){
                console.log(products_result[i]._id);
                product_channels[products_result[i]._id] = sio.of('/'+products_result[i]._id);
                product_channels[products_result[i]._id].on('connection', function(socket){
                    console.log('user connect to'+socket.nsp.name);
                    socket.on('disconnect', function(){});
                    socket.on('createBidding', create_bid);
                    socket.on('acceptBidding', accept_bid);
                })
            }
        }else{
            console.log('There is no product');
        }
      });

      user_room = {};
      user_channels = sio.of('/users');
      user_channels.on('connection', function(socket){
            socket.emit('request_id');
            socket.on('submit_id', function(user_id){
                console.log('User '+ user_id + ' Connect to' +"socket.nsp.name");
                user_room[user_id] = socket;
            })

            socket.on('disconnect', function(){});
            socket.on('recall_bid', recall_bid);
      });
}