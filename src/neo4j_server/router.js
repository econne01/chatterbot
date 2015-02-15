var router = require('express').Router();
var WordCategory = require('./models/wordCategory');
var WordLiteral = require('./models/wordLiteral');

router.get('/', function(request, response) {
    response.type('txt').send('Chatterbot Neo4j main API');
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