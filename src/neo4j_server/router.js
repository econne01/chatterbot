var express = require('express');
var router = express.Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var WordCategory = require('./models/wordCategory');
var WordLiteral = require('./models/wordLiteral');

router.get('/', function(request, response) {
    response.type('txt').send('Chatterbot Neo4j main API');
});

router.get('/id/:nodeId', function(request, response) {
    var nodeId = request.params.nodeId;
    db.getNodeById(nodeId, function (err, node) {
        if (err) {
            response.type('txt').send('Error when retrieving node of id: ' + nodeId);
        }
        response.type('json').send(node.data);
    });
});

router.get('/keywords/:keywordCategory', function(request, response) {
    var keywordCategory = request.params.keywordCategory;
    reqData = {
        "statements" : [{
            "statement" : "MATCH (n) WHERE n.keywordCategory = " + keywordCategory + " RETURN n.keyword"
        }]
    };
    url = 'http://localhost:7474/db/data/transaction/commit';
    db.getNode(url, function (err, node) {
        if (err) {
            response.type('txt').send('Error when retrieving node of keywordCategory: ' + keywordCategory + '  '  + err);
        }
        response.type('json').send(node.data);
    });
});

router.get('/respondTo', function(request, response) {
    var responseData = {testing: true};
    console.log(request.query);

    var checkedWordCount = 0;
    var inputWords = request.query.userInput.split(' ');
    inputWords.forEach(function(inputWord) {
        WordLiteral.where({word: inputWord}, function(err, words) {
            checkedWordCount += 1;
            if (words.length > 0) {
                console.log('found word "' + inputWord + '" with id ' + words[0].id);
                responseData['output'] = 'I see your input=' + words[0].word + '!';
            }
            if (checkedWordCount === inputWords.length) {
                console.log(responseData);
                response.type('json').send(responseData);
            }
        });
    });
});

module.exports = router;