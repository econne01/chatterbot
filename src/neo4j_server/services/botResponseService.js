var WordCategory = require('../models/wordCategory');
var WordLiteral = require('../models/wordLiteral');

var botResponseService = function () {

    /**
     * Determine the best language response for a given user input text
     * and return response text
     */
    this.GET = function handleGetRequest(request, response) {
        var responseData = {};
        var query = 'MATCH (word:WordLiteral)-->(category:WordCategory) WHERE word.word = {inputWord}';
        var opts = {
            varName: 'word',
            computeLevels: 0,
            include: {
                'category': {
                    model: 'WordCategory',
                    rel: 'isWordCategory',
                    direction: 'out',
                    many: false
                }
            }
        };
        WordLiteral.query(query, {inputWord: 'hello'}, opts, function (err, result) {
            console.log('err', err);
            console.log('query with Category found', result);
        });

        var checkedWordCount = 0;
        var inputWords = request.query.userInput.split(' ');
        inputWords.forEach(function(inputWord) {
            WordLiteral.where({word: inputWord}, function(err, words) {
                checkedWordCount += 1;
                if (words.length > 0) {
                    responseData['output'] = 'I see your input=' + words[0].word + '!';
                }
                if (checkedWordCount === inputWords.length) {
                    response.type('json').send(responseData);
                }
            });
        });
    }
};

module.exports = new botResponseService();