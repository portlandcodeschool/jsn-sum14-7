var items = ['Latte', 'Mocha', 'Tea'],
	completed = [],
	express = require('express'),
	completed = require('../public/javascripts/completedController'),
	todos = express.Router();

todos.get('/', function (req, res) {
	res.render('todos',
	{
		items: items,
		partials: {
			header: '../views/partials/_header',
			footer: '../views/partials/_footer'
		}
	});
});

todos.post('/', function (req, res) {
	req.accepts('application/json');
	var item = req.body.todo;

	if ((typeof item) === 'undefined') {
		res.send('Item is undefined');
	} else {
		items.push(item);
		res.send(200, 'Added "' + item + '" to the list!!');
	}
});

todos.delete('/', function (req, res) {
	var requestedId = req.body.id;

	if (isNaN(requestedId)) {
		res.send(400, 'Invalid item id');
	} else if (!items[requestedId]) {
		res.send(404, 'Item not found');
	} else {
		completed.addTodo(items, requestedId);
		items.splice(requestedId, 1);
		res.send(200, "OK: We deleted todo # " + requestedId);
	}
});

module.exports = todos;