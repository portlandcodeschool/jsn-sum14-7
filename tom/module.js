//modules
var http = require('http');
var url = require('url');
var interpolate = require('./interpolator');

//data: Should be metadata and chapters. Chapters an array of objects, matadata just an object
var metadata = {title: "", author: "", subject: "", description: "", publisher: "", rights: "", isbn: "", language: ""};
var chapters = [{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true },
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
{filename: "", toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }];

//templates
var headerPartial =  '<?xml version="1.0" encoding="utf-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n<title>index.xhtml</title>\n<link href="template.css" rel="stylesheet" type="text/css" />\n</head>\n\n<body>\n\n\t<form>\n\n\t\t<fieldset id="meta>';
var metaPartial = '<span class="group"{{label}}: <input type="text" name="{{name}}" /></span>'; 
var descriptionPartial = '<span class="group">Description:<br /><textarea name="description" rows="3" cols="100" /></span><br />';
var centerTemplate = '\t\t</fieldset>\n\n\t\t<fieldset id="files"\n\t\t\t<table id="files>\n\n\t\t\t\t<tr>\n\t\t\t\t\t\t<th>File Name</th>\n\t\t\t\t\t\t<th>ToC Name</th>\n\t\t\t\t\t\t<th>Nav</th>\n\t\t\t\t\t\t<th>Cover Image</th>\n\t\t\t\t\t\t<th>Nonlinear</th>\n\t\t\t\t\t\t<th>Scripted</th>\n\t\t\t\t\t\t<th>SVG</th>\n\t\t\t\t\t\t<th>ToC</th>\n\t\t\t\t</tr>';
var chapterPartial = '\n\t\t\t\t<tr>\n\t\t\t\t\t<td class="filename">{{filename}}</td>\n\t\t\t\t\t<td><input type="text" value="{{toc_name}}" name="toc_name" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="cover_img" name="cover_img" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="nonlinear" name="nonlinear" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="scripted" name="scripted" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="svg" name="svg" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="toc" name="toc" /></td>\n\t\t\t\t</tr>\n';
var footerPartial =  '\t\t\t</table>\n\t\t</fieldset>\n\n\t</form>\n\n</body>\n</html>';

//server application
var server = http.createServer(function (req, res) {


  var pathRequested = url.parse(req.url, true).pathname;
  var queryParam = url.parse(req.url, true).query;
  var queryParamId = parseInt(queryParam.id, 10);

  console.log(url.parse(req.url, true));

  if (pathRequested.slice(0,6) === '/todos') {

    if (req.method === 'POST') {

      var item = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        item += chunk;
      });
      req.on('end', function () {
        items.push(item);
        res.writeHead({'Content-Type': 'text/plain'});
        res.end('OK: Added your todo\n');
      });

    } else if (req.method === 'GET') {

      var responseBody = items.map(function (item, index) {
        return (index + ')' + item + '\n' );
      }).join('\n');
      res.writeHead({'Content-Type': 'text/plain'});
      res.end(responseBody);

    } else if (req.method === 'DELETE') {

      if (isNaN(queryParamId)) {
        res.statusCode = 400; //bad request
        res.end('Invalid todo id');
      } else if (!items[queryParamId]) {
        res.statusCode = 404; // not found
        res.end('Todo not found');
      } else {
        items.splice(queryParamId, 1);
        res.statusCode = 200;
        res.end('OK: We deleted todo # ' + queryParamId);
      }
    } //end DELETE
  }

  if (pathRequested.slice(0,9) === '/contacts') {

    if (req.method === 'POST') {
      var person = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        person += chunk;
      });
      req.on('end', function () {
        contacts.push(JSON.parse(person));
        res.writeHead({'Content-Type': 'text/plain'});
        res.end('OK: Added a new contact\n');
      });
    } else if (req.method === 'GET') {
      contactsPage = headerPartial;

      contacts.forEach(function(item) {
        contactsPage += (interpolate(contactPartial, item));
      });

      contactsPage += footerPartial;

      res.writeHead({'Content-Type': 'application/json'});
      res.end(contactsPage);
    } else if (req.method === 'DELETE') {
      if (isNaN(queryParamId)) {
        res.statusCode = 400;
        console.log(queryParam);
        console.log(queryParamId);
        res.end('Invalid Contact ID');
      } else if (!items[queryParamId]){
        res.statusCode = 404;
        res.end('Contact not found');
      } else {
        contacts.splice(queryParamId, 1);
        res.statusCode = 200;
        res.end('OK: We deleted contact # ' + queryParamId);
      }
    }
  }

});

console.log("listening on localhost, port 3000");
server.listen(3000);
