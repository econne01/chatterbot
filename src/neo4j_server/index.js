'use strict';

var express = require('express');
var http = require('http');

var app = module.exports = express();

// @todo - set variables in config file
var neoPort = 7474;
var env = 'develop';
var developMode = (env === 'develop');

app.set('port', neoPort);

if (developMode) {
    app.use(express.static(__dirname + '/../src'));
}

app.use(function(request, response, next) {
    response.status(404);

    // Default to plain text:
    response.type('txt').send('No neo4j front end available');
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Listening on localhost:' + app.get('port'));
});