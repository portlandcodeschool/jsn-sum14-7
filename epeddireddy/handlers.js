var handler = {};



handler.checkID = function(items, itemID, response) {
	if (isNaN(itemID)) {
		response.statusCode = 400; //bad request
		response.end('Invalid item ID');
		return response;
	} else if (!items[itemID]) {
		response.statusCode = 404; // not found
		response.end('Item not found');
		return response;
	} else {
		return 'valid';
	}
};

module.exports = handler;