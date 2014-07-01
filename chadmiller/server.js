var http        = require('http');
var url         = require('url');
var interpolate = require('./interpolator');
var fs          = require('fs');
var qs          = require('querystring');
var port        = 3000;

var todos = [
  {title: 'do the dishes', due: 'today'},
  {title: 'wash the car', due: 'tomorrow'},
  {title: 'clean the litter box', due: 'today'}
];

// reads the specified html file as a string and replaces the {{ mustaches }}
// with the data object
function compile(view, data) {
  var html = fs.readFileSync('./views/' + view + '.html', 'utf8');

  if (!data)
    return html;

  return interpolate(html, data);
}

// removes a todo from the todos array
function deleteTodo(title) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].title === title)
      todos.splice(i, 1);
  }
}

var server = http.createServer(function(req, res) {
  // basic request logger
  console.log('%s %s %s', req.method, req.url, res.statusCode);

  var requestedUrl = url.parse(req.url, true).pathname;

  if (requestedUrl.slice(0,6) === '/todos') {

    if (req.method === 'GET') {

      // compile and interpolate the header and footer files into strings
      var header   = compile('header', {title: 'Todo App'});
      var footer   = compile('footer');
      var message  = (!todos.length ? 'You have no todos.' : "You've got stuff to do!");
      var todoList = '';
      // use the onClick method of an HTML input element to fire off
      // the deleteTodo function in the browser when the checkbox is checked
      var todoListItem = '<li><input type="checkbox" name="{{title}}"' +
                          'onClick="deleteTodo(this.name)">{{title}} - <b>{{due}}</b></li>';

      todos.forEach(function(todo) {
        todoList += interpolate(todoListItem, todo);
      });

      res.writeHead({'Content-Type': 'text/html'});
      // compile and interpolate the todos.html file with the header,
      // the list of todos, and the footer
      var todoPage = compile('todos', {
        header: header,
        message: message,
        todos: todoList,
        footer: footer
      });

      res.end(todoPage);
    }

    if (req.method === 'POST') {

      var body = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        body += chunk;
      });
      req.on('end', function () {
        // parse the body of the request into a todo {title: 'something', due: 'today'}
        var todo = qs.parse(body);
        // add the todo to the todos array
        todos.push(todo);
        // redirect the page back to itself, which fires off the GET
        // method and refreshes the todos list with the new todo
        res.statusCode = 302;
        res.setHeader("Location", 'http://localhost:3000/todos');
        res.end();
      });

    }

    if (req.method === 'DELETE') {

      var title = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        title += chunk;
      });
      req.on('end', function () {
        // remove the todo from the todos array
        deleteTodo(title);
        // set the status code to 204 No Content in the response back to
        // the client, which is read by the req.onload method
        // (see todos.html)
        res.statusCode = 204;
        res.end();
      });

    }
  }
});

console.log('Listening on port ' + port);
server.listen(port);
