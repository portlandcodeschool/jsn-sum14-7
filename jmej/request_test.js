var discogs = require('discogs');
var request = require('request');

var client = discogs({api_key: 'foo4711'});

client.get('/users/jmejia/wants', function(err, data) {
    console.log(data);
});