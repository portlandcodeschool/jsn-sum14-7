/**
 * Crouse, Matthew JavaScript for homework Seven
 * This is an App that organizes a ToDO list by name or creation date. 
 */ 
var http = require('http');
var url = require('url');
var items = ["Mow the Lawn 1/12", "Do The Dishes 3/14", "Do Homework 4/7", "Eat tacos 6/23"];
var who =['Mark', 'Bill', 'Sarah', 'Bill'];

/**
 * Creates a simple server than has two different addresses 'due' and 'assigned'
 * @param  {[callback]} req [request object]
 * @param  {[response]} res [contains all the information for the response]
 */
var server = http.createServer(function (req, res) {
  var pathRequested = url.parse(req.url, true).pathname;
  console.log(pathRequested);
 if(pathRequested.slice(0) =='/due'){
        switch (req.method) {
          case 'POST':
            var d = new Date()
            var day =d.getDate() ;
            var month = d.getMonth();
            var tempItem = '';
            var tempWho = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
              tempItem += chunk;
              tempWho += chunk;
            });
            //on request end parse the string into two strings by name and by ToDo
            req.on('end', function () {
              tempItem = tempItem.substring(tempItem.indexOf(':')+2);
              tempWho = tempWho.substring(0,tempWho.indexOf(":")-1);
              items.push(tempItem + ' ' + (month+1) +'/' + day);
              who.push(tempWho);
              res.writeHead({'Content-Type': 'text/plain'});
              res.end('OK: Added your todo\n');
            });
            break;
          case 'GET':
            items.forEach(function (item, index) {
              res.write((index + 1) + ') ' + item +   '\n' );
            });
            res.end()
            break;
          case 'DELETE':
          var number ='';
          req.on('data', function (number){
            items.splice(number -1, 1);
            res.end('ok: deleted your todo ' + number);
          })
        }
      }
    if(pathRequested.slice(0) === '/assigned'){
        switch (req.method) {
          case 'POST':
            var d = new Date()
            var day =d.getDate() ;
            var month = d.getMonth();
            var tempItem = '';
            var tempWho = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
              tempItem += chunk;
              tempWho += chunk;
            });
            req.on('end', function () {
              tempItem = tempItem.substring(tempItem.indexOf(':')+2);
              tempWho = tempWho.substring(0,tempWho.indexOf(":")-1);
              items.push(tempItem + ' ' + (month+1) +'/' + day);
              who.push(tempWho);
              res.writeHead({'Content-Type': 'text/plain'});
              res.end('OK: Added your todo\n');
            });
            break;
          case 'GET':

          //organize output by name and and corresponding ToDo
            var toSort =[]
            items.forEach(function (item, index){
              toSort[index] = who[index] + ': ' + item;
            });

            var sorted = toSort.sort();

            sorted.forEach(function (item, index) {
              res.write("* " + item + '\n' );
            });
            res.end()
            break;
          case 'DELETE':
          var number ='';
          req.on('data', function (number){
            items.splice(number -1, 1);
            res.end('ok: deleted your todo ' + number);
          })
        }
      }


});


console.log("listening on port 3000 on localhost");
server.listen(3000);