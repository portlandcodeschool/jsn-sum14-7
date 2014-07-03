var express = require('express');
var TodosRoute = express.Router();

var id = 0;

function Todo(title, dueDate, isComplete) {
  this.id = id++;
  this.title = title;
  this.isComplete = isComplete || false;
  this.dueDate = dueDate || '';
}

var todos = [
  new Todo('wash the car', 'tomorrow'),
  new Todo('clean the litter box', 'today'),
  new Todo('take out the trash', 'today')
];

function deleteTodo(id) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos.splice(i, 1);
      return true;
    }
  }
  return false;
}

TodosRoute.get('/', function(req, res, next) {
  var message = (!todos.length ? "You have no todos." : "You have stuff to do.");

  res.render('todos', {
    partials: {
      header: '../views/partials/_header',
      footer: '../views/partials/_footer'
    },
    message: message,
    todos: todos
  });
});

TodosRoute.post('/todos', function(req, res, next) {
  var title = req.body.title;
  var dueDate = req.body.dueDate;
  var todo = new Todo(title, dueDate);
  todos.push(todo);
  res.json(200, todo);
});

TodosRoute.delete('/todos/:id', function(req, res, next) {
  var id = +req.params.id;
  if (deleteTodo(id))
    res.send(204);
  else
    res.send(404);
});

module.exports = TodosRoute;
