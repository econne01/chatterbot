'use strict';

var express = require('express');
var http = require('http');
var router = require('./router');

var app = express();

// @todo - set variables in config file
var neoPort = 7474;
var env = 'develop';
var developMode = (env === 'develop');

app.set('port', neoPort);

if (developMode) {
    app.use(express.static(__dirname + '/../src'));
}

app.use(function(request, response, next) {
    console.log('Time: %d', Date.now());
    next();
});

app.get('/', function(request, response) {
    response.type('txt').send('Welcome to Chatterbot Neo4j backend API');
});

// use routes
app.use('/api', router);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Listening on localhost:' + app.get('port'));
});