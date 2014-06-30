//modules
var http = require('http');
var url = require('url');
var interpolate = require('./interpolator');

//data
var chapters = [{filename: "1_cover.xhtml", toc_name: "Cover", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true },
  {filename: "2_intro.xhtml", toc_name: "Introduction", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
  {filename: "3_prologue.xhtml", toc_name: "Prologue", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
  {filename: "4_ch1.xhtml", toc_name: "A Long-Expected Party", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
  {filename: "5_ch2.xhtml", toc_name: "The Shadow of the Past", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
  {filename: "6_ch3.xhtml", toc_name: "Three is Company", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
  {filename: "7_ch4.xhtml", toc_name: "A Short Cut to Mushrooms", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }, 
  {filename: "8_ch5.xhtml", toc_name: "A Conspiracy Unmasked", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true }];

chapters.title = "The Fellowship of the Ring";
chapters.author = "JRR Tolkien";
chapters.subject = "fantasy";
chapters.description = "The first book in the epic Lord of the Rings trilogy";
chapters.publisher = "Alin and Unwin";
chapters.rights = "copyright 1954";
chapters.isbn = "978something";
chapters.language = "en";

//templates
var headerTemplate =  '<?xml version="1.0" encoding="utf-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n<title>index.xhtml</title>\n<!-- <link href="template.css" rel="stylesheet" type="text/css" /> -->\n</head>\n\n<body>\n\n\t<form>\n\n\t\t<fieldset id="meta">';
var metaTemplate = '<span class="group">Title: <input type="text" value="' + chapters.title +'" name="title" /></span>\n<span class="group">Author: <input type="text" value="' + chapters.author + '" name="author" /></span>\n<span class="group">Subject: <input type="text" value="' + chapters.subject + '" name="subject" /></span>\n<br /><span class="group">Description:<br /><textarea value="' + chapters.descripton + '" name="description" rows="3" cols="100"></textarea></span><br />\n<span class="group">Publisher: <input type="text" value="' + chapters.publisher + '" name="publisher" /></span>\n<span class="group">Rights: <input type="text" value="' + chapters.rights + '" name="rights" /></span>\n<span class="group">ISBN: <input type="text" value="' + chapters.isbn + '" name="isbn" /></span>\n<span class="group"><br />Language: <input type="text" value="' + chapters.language + '" name="language" /></span>\n'; 
var centerTemplate = '\t\t</fieldset>\n\n\t\t<fieldset id="files">\n\t\t\t<table id="files">\n\n\t\t\t\t<tr>\n\t\t\t\t\t\t<th>File Name</th>\n\t\t\t\t\t\t<th>ToC Name</th>\n\t\t\t\t\t\t<th>Nav</th>\n\t\t\t\t\t\t<th>Cover Image</th>\n\t\t\t\t\t\t<th>Nonlinear</th>\n\t\t\t\t\t\t<th>Scripted</th>\n\t\t\t\t\t\t<th>SVG</th>\n\t\t\t\t\t\t<th>ToC</th>\n\t\t\t\t</tr>';
var chapterPartial = '\n\t\t\t\t<tr>\n\t\t\t\t\t<td class="filename">{{filename}}</td>\n\t\t\t\t\t<td><input type="text" value="{{toc_name}}" name="toc_name" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="nav" name="nav" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="cover_img" name="cover_img" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="nonlinear" name="nonlinear" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="scripted" name="scripted" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="svg" name="svg" /></td>\n\n\t\t\t\t\t<td><input type="checkbox" value="toc" name="toc" /></td>\n\t\t\t\t</tr>\n';
var footerPartial =  '\t\t\t</table>\n\t\t</fieldset>\n\n\t</form>\n\n</body>\n</html>';

//server application
var server = http.createServer(function (req, res) {

  var pathRequested = url.parse(req.url, true).pathname;
  var queryParam = url.parse(req.url, true).query;
  var queryId = parseInt(queryParam.id, 10);

  console.log(url.parse(req.url, true));

  if (req.method === 'POST') { //add a chapter filename
    var newChapter = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
      newChapter += chunk;
    });
    req.on('end', function () {
      chapters.push({filename: newChapter, toc_name: "", nav: false, cover_img: false, nonlinear: false, scripted: false, svg: false, toc: true}); 
      res.writeHead({'Content-Type': 'text/plain'});
      res.end('New chapter added!\n');
    });
  }

  if (req.method === 'GET') { //send the info
    pageContent = headerTemplate + metaTemplate + centerTemplate;
    chapters.forEach(function(chapter) {
      pageContent += (interpolate(chapterPartial, chapter));
    });
    pageContent += footerPartial;
    res.writeHead({'Content-Type': 'application/json'});
    res.end(pageContent);
    }

  if (req.method === 'DELETE') { //remove a chapter if a number, or clear meta
    
    if ( queryId !== queryId ) {
      //it's a non-numeric string
      res.statusCode = 400;
      res.end('Invalid file identifier');
    } else if ( !chapters[queryId] ) {
      res.statusCode = 404;
      res.end('Chapter not found');
    } else { 
      //it's a numeric string
      console.log('inside delete: else');
      chapters.splice(queryId, 1);
      res.statusCode = 200;
      res.end('Chapter deleted!');
    }
    console.log("ebook info removed!");
  }
});

console.log("listening on localhost, port 3000");
server.listen(3000);
