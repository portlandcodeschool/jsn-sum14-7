var http = require('http');
var url = require('url');
var interpolate = require('./interpolator.js');

var partials = {};
partials.header = "<html><header><h1>Welcome to Todo-App!</h1></header>";
partials.todo = "<li><strong>Id:</strong> {{id}} <strong>Description:</strong> {{description}} <strong>Due date:</strong> {{due}}</li>";
partials.footer = "<small>Created by Geoff Unger</small></html>";

var dataStore = [
    {id: 0, description: "test", due: 1403989999, created: 1403989901},
    {id: 1, description: "test 2", due: 1403989999, created: 1403989901}
];

var server = http.createServer(function (req, resp) {
    var method = req.method;
    switch (method) {
        case "GET":
        {
            resp.writeHead(200, {'Content-Type': 'text/html'});
            resp.write(partials.header);
            resp.write("<ul>");
            dataStore.map(function (item) {
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
                dataStore.push(JSON.parse(postBody));
                resp.end('Todo ' + postBody + ' added to list');
            });
        }
            break;
        case "PUT":
        {
            var postBody = "";
            req.on('data'), function(data){
                postBody += data;
            }
            req.end(function(){
                var found = false;
                postBody = JSON.parse(postBody);
                dataStore.map(function(item){
                    if(item.id == postBody.id){
                        item.description = postBody.description;
                        found = true;
                    }
                });
                if(!found){
                    resp.statusCode = 400;
                    resp.end("Item not found");
                }
                else{
                    resp.end("Item with id: " +  + " updated.");
                }
            });
        }
            break;
        case "DELETE":
        {
            var itemFound = false;
            var parsedURL = url.parse(req.url);
            var deleteID = parsedURL.path.split("/")[1];
            dataStore.map(function(item, index){

                if(item.id == deleteID){
                    itemFound = true;
                    dataStore.splice(deleteID, 1);
                    console.log("setting found to true");
                }
            });

                if(itemFound != true){
                    console.log(itemFound);
                    resp.statusCode = 400;
                    resp.end("Item not found");
                }
                else{
                    resp.end("Item with id: " + deleteID  + " deleted.");
                }

        }
            break;
        default :
        {
        }
    }

});

server.listen(8080);

