var http = require('http'),
	url = require('url'),
	items = [],
	completed = [];

var server = http.createServer( function (request, response) {
	var path = url.parse(request.url, true).pathname;

	switch (request.method) {
		case 'GET':
			var header = 'List of TODO items:\n';
			if (items.length === 0) {
				header += 'No tasks yet. Add some!\n';
			}
			response.write(header);
			
			// Return list of TODO items
			var output = '';
			items.forEach(function (item, index) {
				output = (index + 1) + '. ' + item + '\n';
				response.write(output);
			});

			// Return a list of completed items
			if (completed.length > 0) {
				var completedHeader = '\nList of completed items:\n';
				response.write(completedHeader);
				var completedList = '';
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
		case 'DELETE':
			var itemID = parseInt(path.slice(1), 10);
			if (isNaN(itemID)) {
				response.statusCode = 400; //bad request
		      	response.end('Invalid item ID');
		    } else if (!items[itemID]) {
		      	response.statusCode = 404; // not found
		      	response.end('Item not found');
		    } else {
				completed.push(items[itemID]);
				response.end('Deleted "' + items[itemID] + '" from the list.');
				items.splice(itemID, 1);
			}
			break;
	}
});

server.listen(8000);