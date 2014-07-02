var http = require('http'),
	url = require('url'),
	items = [],
	completed = [],
	handler = require('./handlers.js'),
	appHeader = "<html><header><h1>To-do App</h1></header></html>";

var server = http.createServer( function (request, response) {
	var path = url.parse(request.url, true).pathname;
	console.log(path);

	switch (request.method) {
		case 'GET':
			var todoHeader = "<html><header><h2><i>To-do Items</i></h2></header></html>";
			response.write(appHeader);

			if (items.length === 0) {
				todoHeader += 'No tasks yet. Add some!\n';
			}
			response.write(todoHeader);
			
			// Return list of TODO items
			var output = '<ol>';
			response.write(output);
			items.forEach(function (item, index) {
				// output = (index + 1) + '. ' + item + '\n';
				output = '<li>' + item + '</li>';
				response.write(output);
			});

			output = '</ol>';
			response.write(output);

			// Return a list of completed items
			if (completed.length > 0) {
				var completedHeader = "<html><header><h2><i>Completed Items</i></h2></header></html>",
					completedList = '';

				response.write(completedHeader);
				completed.forEach(function (task, index) {
					completedList = (index + 1) + '. ' + task + '\n';
					response.write(completedList);
				});
			}
			response.end();
			break;
		case 'POST':
			var item = '';
			request.setEncoding('utf8');
			request.on('data', function (chunk) {
				item += chunk;
			});
			request.on('end', function () {
				items.push(item);
				response.end('Added "' + item + '" to the list!');
			});
			break;
		case 'PUT':
			var updatedTask = '',
				itemID = parseInt(path.slice(1), 10),
				validity = handler.checkID(items, itemID, response);
			console.log('Inside PUT: ' + itemID);

			if (validity === 'valid') {
				request.setEncoding('utf8');
				request.on('data', function (chunk) {
					updatedTask += chunk;
					console.log('inside chunking: ' + updatedTask);
				});
				request.on('end', function () {
					items[itemID] = updatedTask;
					response.end('Updated item #' + itemID + ' to ' + updatedTask);
				});
			} else {
				response.end(validity);
			}
			break;
		case 'DELETE':
			var itemID = parseInt(path.slice(1), 10),
				validity = handler.checkID(items, itemID, response);

			if (validity === 'valid') {
				completed.push(items[itemID]);
				response.end('Deleted "' + items[itemID] + '" from the list.');
				items.splice(itemID, 1);
			} else {
				response.end(validity);
			}
			break;
	}
});

server.listen(8000);