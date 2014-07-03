
function request(method, url, data, cb) {
  var req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(data));
  req.onload = function() {
    if (req.status >= 300) {
      cb && cb(new Error(req.status));
    } else if (req.status === 204) {
      cb && cb();
    } else {
      cb && cb(null, JSON.parse(req.response));
    }
  };
}

function addTodo(form) {
  var title = form.title.value;
  var dueDate = form.dueDate.value;
  request('POST', '/todos', {title: title, dueDate: dueDate}, function() {
    window.location.reload();
  });
  return false;
}

function deleteTodo(todo) {
  request('DELETE', '/todos/' + todo.id, {}, function() {
    window.location.reload();
  });
}

