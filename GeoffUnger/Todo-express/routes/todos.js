var express = require('express');
var router = express.Router();
var ds = require('../bin/dataStore.js');
var todos = ds.getItem();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('todos', { title: 'Todos' });
});

module.exports = router;
