var http = require('http');
var url = require('url');
var fs = require('fs');
var interpolate = require('./interpolator');

var headerPartial = '<html><head><title>World Cup Score Reporter</title><link href="http://fonts.googleapis.com/css?family=Oxygen:400,300,700" rel="stylesheet" type="text/css"><link rel="stylesheet" type="text/css" href="main.css"></head><body><header><div class="container"><nav><ul><li><a href="./">Home</a></li><li><a href="./results">Detailed Results</a></li></ul></nav><h1>World Cup Score Reporter</h1></div></header>';
var homePartialTop = '<div class="container"><h2 class="main-title">Team Summaries:</h2><ul class="team-results">';
var homeResults = '<li><h3 class="main-title">{{team}}:<h3></li><li>{{wins}}-{{losses}}-{{ties}}</li>';
var resultsPartialTop = '<div class="container"><h2 class="main-title">Detailed Match Results:</h2>';
var partialBottom = '</ul></div>';
var footerPartial = '<footer><div class="container"><span class="small-text">Based off of Portland Code School\'s To-Do app example</span></div></footer></body>';

var teams = [
    { team: "Germany",
      wins: 1,
      losses: 0,
      ties: 0,
      matches: [
        { opponent: "USA",
          date: "06-26-14",
          score: "1-0",
          win: true,
          loss: false,
          tie: false
        }
      ]
    },
    { team: "USA",
      wins: 0,
      losses: 1,
      ties: 0,
      matches: [
        { opponent: "Germany",
          date: "06-26-14",
          score: "0-1",
          win: false,
          loss: true,
          tie: false
        }
      ]
    },
    { team: "Ghana",
      wins: 0,
      losses: 1,
      ties: 1,
      matches: [
        { opponent: "Germany",
          date: "06-21-14",
          score: "2-2",
          win: false,
          loss: false,
          tie: true
        },
        { opponent: "USA",
          date: "06-16-14",
          score: "1-2",
          win: false,
          loss: true,
          tie: false
        },
        { opponent: "Portugal",
          date: "06-18-14",
          score: "1-2",
          win: false,
          loss: true,
          tie: false
        }
      ]
    }
];

var server = http.createServer(function (req, res) {

    console.log(url.parse(req.url, true));
    
    var pathRequested = url.parse(req.url, true).pathname;
    var queryParam = url.parse(req.url, true).query;

    if (pathRequested === '/main.css') {
      if (req.method === 'GET') {
        fs.readFile('main.css', function(err, data) {
          if (err) throw err;
          res.writeHead({'Content-Type': 'text/css'});
          res.end(data);
        });
      }
    }

    if (pathRequested === '/results') {
      if (req.method === 'GET') {
        var totalTeamResults = [];
        for (i = 0; i < teams.length; i++) {
          totalTeamResults.push(teams[i].team.toString()+': '+teams[i].wins.toString()+'-'+teams[i].losses.toString()+'-'+teams[i].ties.toString());
          for (j = 0; j < teams[i].matches.length; j++) {
            totalTeamResults.push(teams[i].matches[j].score.toString()+' vs '+teams[i].matches[j].opponent.toString()+' on '+teams[i].matches[j].date.toString());
          }
        }
        var responseBody = headerPartial + resultsPartialTop + totalTeamResults.join('\n') + partialBottom + footerPartial;
        res.writeHead({'Content-Type': 'text/html'});
        res.end(responseBody);
      }

      if (req.method === 'POST') {
        var result = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
          result += chunk;
        });
        req.on('end', function() {
          var resultObject = JSON.parse(result);
          if (!resultObject.team || !resultObject.matches) {
            res.end('You need to include a team and a result in your submission.');
          } else {
            var requestTeam = resultObject.team;
            var matchResult = resultObject.matches;
            for (i = 0; i < teams.length; i++) {
              for(var prop in teams[i]) {
                if(teams[i].hasOwnProperty(prop)) {
                  if(teams[i][prop] === requestTeam) { //team already exists, so add the score to it
                    var correcti = i;
                    for (j = 0; j < matchResult.length; j++) {
                      teams[i].matches.push(matchResult[j]);
                      if (matchResult[j].win === true) {
                        teams[i].wins += 1;
                      } else if (matchResult[j].tie === true) {
                        teams[i].ties += 1;
                      } else {
                        teams[i].losses += 1;
                      }
                    }
                    // function addAllMatches(element, index, arr) { //this didn't work :( teams[i].matches.length got the wrong length on line 77
                    //   arr.push(matchResult[index]);
                    // }
                    // teams[i].matches.forEach(addAllMatches);
                    res.writeHead({'Content-Type': 'text/html'});
                    res.end('OK: Match result added');
                  }
                } else { //team doesn't exist, so add it
                  teams.push(resultObject);
                }
              }
            }
          }
        });
      }
    }

    if (pathRequested === '/') {
      if (req.method === 'GET') {
        var homeResult = '';
        teams.forEach(function(item) {
          homeResult += interpolate(homeResults, item);
        });
        var responseBody = headerPartial + homePartialTop + homeResult + partialBottom + footerPartial;
        res.writeHead({'Content-Type': 'text/html'});
        res.end(responseBody);
      }
    }
});

console.log("Listening on localhost, port 3000");
server.listen(3000);