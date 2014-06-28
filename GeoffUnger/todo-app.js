var http = require('http');
var url = require('url');

var dataStore = [
    {id: 0, description: "test", due: 1403989999, created: 1403989901},
    {id: 1, description: "test 2", due: 1403989999, created: 1403989901}
];

var server = http.createServer(function (req, resp) {
    var method = req.method;
    switch (method) {
        case "GET":
        {
            dataStore.map(function (item) {
                resp.write(item.id + " " + item.description + " " + item.due + " " + item.created + "\n");

            })
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
                postBody = JSON.parse(postBody);
                dataStore.map(function(item){
                    if(item.id == postBody.id){
                        item.description = postBody.description;

                    }
                });
            });
        }
            break;
        case "DELETE":
        {
            var parsedURL = url.parse(req.url);
            var deleteID = parsedURL.path.split("/")[1];
            resp.end(deleteID);
        }
            break;
        default :
        {
        }
    }

});

server.listen(8080);

