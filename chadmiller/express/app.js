var express     = require('express');
var bodyParser  = require('body-parser');
var path        = require('path');
var logger      = require('morgan');
var consolidate = require('consolidate');

// start express
var app = express();

// template configuration
app.engine('html', consolidate.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/todos'));

// midleware error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/

app.set('port', process.env.PORT);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port # ' + app.get('port'));
});

