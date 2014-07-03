// var items = ['Chai'],
var express = require('express'),
	completed = express.Router(),
	controller = require('../public/javascripts/completedController');

completed.get('/', function (req, res) {
	res.render('completed-todos',
	{
		items: controller.getCompletedTodos(),
		partials: {
			header: '../views/partials/_header',
			footer: '../views/partials/_footer'
		}
	});
});

module.exports = completed;