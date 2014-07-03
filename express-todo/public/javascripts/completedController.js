var completed = {},
	completedItems = [];

completed.addTodo = function (items, itemID) {
	var completedItem = items[itemID];
	completedItems.push(completedItem);
	console.log('Added ' + completedItem + ' to your list of completed todos!');
};

completed.getCompletedTodos = function () {
	return completedItems;
};

module.exports = completed;