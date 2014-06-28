var http = require('http');
var url = require('url');

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
        }
      ]
    }
];

var server = http.createServer(function (req, res) {

    console.log(url.parse(req.url, true));
    
    var pathRequested = url.parse(req.url, true).pathname;
    var queryParam = url.parse(req.url, true).query;

    if (pathRequested === '/results') {
      if (req.method === 'GET') {
        var totalTeamResults = [];
        for (i = 0; i < teams.length; i++) {
          totalTeamResults.push(teams[i].team.toString()+': '+teams[i].wins.toString()+'-'+teams[i].losses.toString()+'-'+teams[i].ties.toString());
          for (j = 0; j < teams[i].matches.length; j++) {
            totalTeamResults.push(teams[i].matches[j].score.toString()+' vs '+teams[i].matches[j].opponent.toString()+' on '+teams[i].matches[j].date.toString());
          }
        }
        var responseBody = totalTeamResults.join('\n');
        res.writeHead({'Content-Type': 'text/html'});
        res.end(responseBody);
      }
    }

    if (pathRequested === '/') {
      if (req.method === 'GET') {
        function parseTeamData(data) {
          var teamsAndRecords = [];
          for (i = 0; i < data.length; i++) {
            teamsAndRecords.push(data[i].team.toString()+': '+data[i].wins.toString()+'-'+data[i].losses.toString()+'-'+data[i].ties.toString());
          }
          return teamsAndRecords.join('\n');
        }
        var responseBody = parseTeamData(teams);
        res.writeHead({'Content-Type': 'text/html'});
        res.end(responseBody);
      }
    }
});

console.log("Listening on localhost, port 3000");
server.listen(3000);