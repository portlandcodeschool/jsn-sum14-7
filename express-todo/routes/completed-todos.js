var items = ['Chai'];

module.exports = function (req, res) {
	res.render('completed-todos',
	{
		items: items,
		partials: {
			header: '../views/partials/_header',
			footer: '../views/partials/_footer'
		}
	});
};