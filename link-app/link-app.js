//modules
var http = require('http');
var url = require('url');
var interpolate = require('./interpolator');

//data 
var type = ["Service", "Interview", "Article", "Download", "Video", "Blog", "Label"];
var links = [
    {title: "Spotify", url: "http://www.spotify.com", linkType: type[0]},
    {title: "DUTTY ARTZ", url: "http://www.duttyartz.com", linkType: type[6]},
    {title: "Best Music Video Ever", url: "http://youtu.be/dQw4w9WgXcQ", linkType: type[4]}
];

//templates
var headerPartial =  '<body><head><title>Music Links</title></head><h2>&#8795; Music Links</h2><ol>';
var linkPartial = '<li><a href="{{url}}">{{title}}</a> <small>[{{linkType}}]</small></li>';
var footerPartial =  '</ol><footer>2014</footer></body>';
var linksPage = '';

//server application
var server = http.createServer(function (req, res) {


  var pathRequested = url.parse(req.url, true).pathname;
  var queryParam = url.parse(req.url, true).query;
  var queryParamId = parseInt(queryParam.id, 10);

  console.log(url.parse(req.url, true));

 if (pathRequested.slice(0,9) === '/links') {

    if (req.method === 'POST') {
      var newlink= '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        newlink+= chunk;
      });
      req.on('end', function () {
        links.push(JSON.parse(newlink));
        res.writeHead({'Content-Type': 'text/plain'});
        res.end('OK: Added a new link\n');
      });
    } else if (req.method === 'GET') {
      linksPage = headerPartial;

      links.forEach(function(item) {
        linksPage += (interpolate(linkPartial, item));
      });

      linksPage += footerPartial;

      res.writeHead({'Content-Type': 'application/json'});
      res.end(linksPage);
    } else if (req.method === 'DELETE') {
      if (isNaN(queryParamId)) {
        res.statusCode = 400;
        console.log(queryParam);
        console.log(queryParamId);
        res.end('Invalid Link ID');
      } else if (!items[queryParamId]){
        res.statusCode = 404;
        res.end('Link not found');
      } else {
        links.splice(queryParamId, 1);
        res.statusCode = 200;
        res.end('OK: We deleted Link # ' + queryParamId);
      }
    }
  }

});

console.log("listening on localhost, port 3000");
server.listen(3000);

