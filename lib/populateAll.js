var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (items, property, property_model, callback) {
    if (items.length > 0){
        function fill_first_result(waterfall_callback){
            var qq = keystone.list(property_model).model.findOne({'_id': items[0][property]});
            qq.exec(function(err, property_result){
               items[0][property] = property_result;
               if (items.length==1)
                    waterfall_callback(null,'Complete!'); 
                else
                    waterfall_callback(null,1);
            }) ;
        };

        function fill_result(id, waterfall_callback){
            var qq = keystone.list(property_model).model.findOne({'_id': items[id][property]});
            qq.exec(function(err, property_result){
               items[id][property] = property_result;
               if (id <items.length -1)
                waterfall_callback(null,id+1);
               else
                waterfall_callback(null,'Complete'); 
            });          
        };

        var tasks =  [fill_first_result];
        for (i = 1;i<items.length;i++){
            tasks.push(fill_result);
        }

        async.waterfall(tasks, function(err, waterfall_result){
            callback();
        });
    }else{
        callback();
    }
}