var http = require('http');
var url = require('url');
var interpolate = require('./interpolator.js');
var Datastore = require('./dataStore.js');

var ds = new Datastore;

var partials = {};
partials.header = "<html><header><h1>Welcome to Todo-App!</h1></header>";
partials.todo = "<li><strong>Id:</strong> {{id}} <strong>Description:</strong> {{description}} <strong>Due date:</strong> {{due}}</li>";
partials.footer = "<small>Created by Geoff Unger</small></html>";

var server = http.createServer(function (req, resp) {
    var method = req.method;
    var todos = ds.getItem();
    switch (method) {
        case "GET":
        {
            resp.writeHead(200, {'Content-Type': 'text/html'});
            resp.write(partials.header);
            resp.write("<ul>");

            todos.map(function (item) {
                var listItem = partials.todo;
                listItem = interpolate(listItem,item);
                resp.write(listItem);

            });
            resp.write("</ul>");
            resp.write(partials.footer);
            resp.end();

        }
            break;
        case "POST":
        {
            var postBody = "";
            req.on('data', function (data) {
                postBody += data;
            });
            req.on('end', function () {
                var description = postBody.split("\n")[0];
                var dueDate = postBody.split("\n")[1];
                ds.addItem(description, dueDate);
                resp.end('Todo ' + description + ' added to list');
            });
        }
            break;
        case "PUT":
        {
            var parsedURL = url.parse(req.url);
            var updateID = parsedURL.path.split("/")[1];
            var postBody = "";
            req.on('data', function(data){
                postBody += data;
            });
            req.on('end',function(){
                var description = postBody.split("\n")[0];
                var dueDate = postBody.split("\n")[1];
                result = ds.updateItem(updateID-1,description, dueDate);
                if(result){
                    resp.statusCode = 200;
                    resp.end("Item with id: " + updateID + " updated.");
                }
                else{
                    resp.statusCode = 400;
                    resp.end("Could not find item with ID :" + updateID);
                }
            });
        }
            break;
        case "DELETE":
        {

            var parsedURL = url.parse(req.url);
            var deleteID = parsedURL.path.split("/")[1];
            result = ds.deleteItem(deleteID);
            if(result){
                resp.statusCode = 200;
                resp.end("Item with id: " + deleteID + " deleted.");
            }
            else{
                resp.statusCode = 400;
                resp.end("Could not find item with ID :" + deleteID);
            }

        }
            break;
        default :
        {
        }
    }

});

server.listen(8080);

