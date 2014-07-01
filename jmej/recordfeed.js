var http = require('http');
var url = require('url');
var discogs = require('discogs');
var request = require('request');
var interpolate = require('./interpolator');

var records = [{discogs: "http://www.discogs.com/Sue%C3%B1o-Latino-Luxuria/release/120181", youtube: "JL92HkP96uU"}, {discogs: "http://www.discogs.com/Stenny-Andrea-Vostok-Smokescreen/release/4940085", youtube: "9uR0LJ_m6rY"} 
] //this should pull from discogs in the next rev: http://www.discogs.com/developers/resources/user/wantlist.html

//templates
var headerPartial =  '<html><body><head><title>Record Feed</title></head><h1>Record Feed</h1>';
var recordsPartial = '<ul><li><iframe width="420" height="315" src="//www.youtube.com/embed/{{youtube}}"frameborder="0" allowfullscreen></iframe></li><li><a href="{{discogs}}">click here for discogs release page</a></ul>';
var footerPartial =  '<footer>jams.</footer></body></html>';
var recordsPage = '';

//getting releases from discogs - only works if wantlist is public

var wantList = {}; // this gets filled with the full discogs JSON wantlist data
var release = {}; // this gets filled with discogs release db info
var recordIds = []; // this gets filled with the discogs id for each wantlist item
var wantVids = []; // this gets filled with all the youtube links via discogs db
var user = "jmejia";
var client = discogs({api_key: 'foo4711'});  //that api key came from the discogs node module. no idea who owns it.


var getIds = function(callback){
	client.get('/users/'+user+'/wants', function(err, data) {
		var wantArr = [];
	    wantList = data;  // this is the full discogs JSON wantlist data
	    wantList.wants.forEach(function (item, index){ //this grabs the discogs id of every release in the discogs wantlist
	    	wantArr.push(item.basic_information.id);
	    	});
	     callback(wantArr)
	});
}

getIds(function(arr){
    	client.get('/releases/'+item, function(err, vids) { //this grabs the youtube link from the releases part of the discogs db api    		
    	vidArr = [];
    	vidArr.push(vids.videos[0].uri);
    	vidArr.forEach(function (item, index){
    	}); 
    	console.log(vidArr)
	});
});

//end discogs API stuff


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