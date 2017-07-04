var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

    locals.data = { 
        row: [],
    };
    
    // Load all Products
    view.on('init', function(next) {
    
    var q = keystone.list('Product').model.find();
        q.exec(function(err, result) {
            if(result != null)
            {
                for (var i = 0;i<result.length;i=i+3){      
                    if (i+2<result.length){
                        locals.data.row.push([result[i], result[i+1], result[i+2]]);
                    }else{
                        var temp = [];
                        for (var j = i;j<result/length;j++)
                            temp.push(result[j]);
                        locals.data.row.push(temp);
                    }
                }
            }
            else
            {
                return res.status(404).send(keystone.wrapHTMLError('Sorry, no product found! (404)'));
            }
            
            next(err);
        });
    });



	// Render the view
	view.render('index');
};
