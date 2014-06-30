var http = require('http');
var url = require('url');
var interpolate = require('./interpolator');

var records = [{discogs: "http://www.discogs.com/Stenny-Andrea-Vostok-Smokescreen/release/4940085", youtube: "9uR0LJ_m6rY"}, 
{discogs: "http://www.discogs.com/Sue%C3%B1o-Latino-Luxuria/release/120181", youtube: "JL92HkP96uU"}] //this should pull from discogs in the next rev: http://www.discogs.com/developers/resources/user/wantlist.html

//templates
var headerPartial =  '<body><head><title>Record Feed</title></head><h1>Record Feed</h1>';
var recordsPartial = '<ul><li><iframe width="420" height="315" src="//www.youtube.com/embed/{{youtube}}"frameborder="0" allowfullscreen></iframe></li><li><a href="{{discogs}}">click here for discogs release page</a></ul>';
var footerPartial =  '<footer>jams.</footer></body>';
var recordsPage = '';


var server = http.createServer(function (req, res) {
	var pathRequested = url.parse(req.url, true).pathname;
	switch (req.method){
		case 'POST':
			var item = '';
			req.setEncoding('utf8');
			req.on('data', function (chunk){
				item += chunk;
			});
			req.on('end', function() {
				records.push({youtube:item, discogs:""});
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Added your jam.\n')
			});
		break;
			
    	case 'GET':
    	recordsPage = headerPartial;

      	records.forEach(function(item, index) {
        recordsPage += interpolate(recordsPartial, item);
     		});
      	      recordsPage += footerPartial;

      	res.writeHead({'Content-Type': 'text/plain'});
      	res.end(recordsPage);
      	res.end();
      	break;
  }	
});

console.log("listening on port 3000 on localhost");
server.listen(3000);