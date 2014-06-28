module.exports = function (itemsArray) {
	var output = '';
	itemsArray.forEach(function (item, index) {
		output = (index + 1) + '. ' + item + '\n';
		console.log(output);
	});
	return output;
};