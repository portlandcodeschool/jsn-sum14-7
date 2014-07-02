var items = ['Latte', 'Mocha', 'Tea'];

// module.exports = {
// 	get: function (req, res) {
// 		res.render('todos',
// 		{
// 			items: items,
// 			partials: {
// 				header: '../views/partials/_header',
// 				footer: '../views/partials/_footer'
// 			}
// 		});
// 	},

// 	post: function (req, res) {
// 		req.accepts('application/json');
// 		var item = req.body.todo;
// 		console.log(item);
// 		console.log('here');
// 		items.push(item);
// 		res.send(200, 'Added "' + item + '" to the list!');
// 	},

// 	delete: function (req, res) {
// 		var requestID = req.params.id;

// 		if (isNaN(requestedId)) {
// 			res.send(400, 'Invalid item id');
// 		} else if (!items[requestedId]) {
// 			res.send(404, 'Item not found');
// 		} else {
// 			items.splice(requestedId, 1);
// 			res.send(200, "OK: We deleted todo # " + requestedId);
// 		}
// 	}
// };

var express = require('express');
var todos = express.Router();

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
	console.log(item);
	console.log('here');
	items.push(item);
	res.send(200, 'Added "' + item + '" to the list!');
});

todos.delete('/:id', function (req, res) {
	var requestID = req.params.id;

	if (isNaN(requestedId)) {
		res.send(400, 'Invalid item id');
	} else if (!items[requestedId]) {
		res.send(404, 'Item not found');
	} else {
		items.splice(requestedId, 1);
		res.send(200, "OK: We deleted todo # " + requestedId);
	}
});

module.exports = todos;
