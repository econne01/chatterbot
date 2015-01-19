var express = require('express'),
    http = require('http'),
    url = require('url'),
    neo4j = require('node-neo4j');

// @todo - possibly make this configurable from command line
var port = 8888;
var app = express();

http.createServer(app);


// Static assets
app.use(express.static(__dirname));

app.get('', function(request, response) {
    response.sendfile(__dirname + '/src/index.html');
});

app.listen(port);
