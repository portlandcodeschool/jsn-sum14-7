var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');

// bring in route handler functions
var indexRoute = require('./routes/index');
var todosRoute = require('./routes/todos');
// var completedRoute = require('./routes/completed-todos');


// start express
var app = express();

// view engine setup
app.engine('html', consolidate.hogan);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// express middleware
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// express routes
app.get('/', indexRoute);
app.get('/todos', todosRoute.get);
app.del('todos/:id', todosRoute.del);
app.post('todos/', todosRoute.post);
// app.get('/completed-todos', completedRoute);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
