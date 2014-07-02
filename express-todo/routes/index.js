// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

module.exports = function (req, res) {
	res.render('index', {
		partials: {
			header: '../views/partials/_header', 
			footer: '../views/partials/_footer'
		}
	});
};