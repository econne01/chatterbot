var express = require('express'),
    http = require('http'),
    url = require('url'),
    neo4j = require('neo4j');

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

var db = new neo4j.GraphDatabase('http://localhost:7474');
var node = db.createNode({hello: 'world'});     // instantaneous, but...
node.save(function (err, node) {    // ...this is what actually persists.
    if (err) {
        console.error('Error saving new node to database:', err);
    } else {
        console.log('Node saved to database with id:', node.id);
    }
});