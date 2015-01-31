var express = require('express');
var http = require('http');
var router = require('./src/neo4j_server/router');

// @todo - set variables in config file
var env = 'develop';
var developMode = (env === 'develop');
var neo4jPort = 3000;

var app = express();

app.set('port', neo4jPort);

// Static assets
if (developMode) {
    app.use(express.static(__dirname));
}

app.use(function(request, response, next) {
    console.log('Time: %d', Date.now());
    next();
});

app.get('', function(request, response) {
    response.sendfile(__dirname + '/src/app/index.html');
});

// use routes
app.use('/api', router);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Listening on localhost:' + app.get('port'));
});