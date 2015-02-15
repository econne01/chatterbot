var chatterbotServices = angular.module('chatterbotServices');

chatterbotServices.factory('conversationService', [
    '$http',
    '$q',
    function (
        $http,
        $q
    ) {
        // Note 'g' denotes global: we always find all instances of RegExp in a string
        var keywordRegExp = RegExp('<[\\w]+>', 'g');
        var keyPhraseRegex = RegExp('{[\\w]+}', 'g');
        var optionalRegex = RegExp('\\[.+?\\]', 'g'); // .+? is a non-greedy regExp
        var punctuationRegex = /[\?\.,\'\"\(\)\[\]]/g;

        var conversationServiceInstance = {

//            /**
//             * Break the phrase into space-delimited words, after ignoring case, punctuation
//             * and replacing contractions with full words (if possible)
//             * @param {string} phrase
//             * @returns {Array.<string>}
//             */
//            splitPhraseToWords : function splitPhraseToWords(phrase) {
//                phrase = phrase.toLowerCase();
//                phrase = phrase.replace(punctuationRegex, '');
//                var words = phrase.split(' ');
//                return words;
//            },
//
//            /**
//             * Return a list of abstract phrases that might describe what the words from an input
//             * phrase mean
//             * (use this method when trying to figure out what the hell someone is saying).
//             * @example searchForRelatedPhrases(['how', 'you', 'doing', 'man']) => ['how are you']
//             * @param userInput
//             * @returns {Array.<string>}
//             */
//            searchForRelatedPhrases : function searchForRelatedPhrases(words) {
//                var req = {
//                    method: 'GET',
//                    url: 'http://localhost:3000/api/respondTo',
//                    params: {userInput: words.join(' ')}
//                };
//
//                var output = 'how are you';
//                $http(req).success(function (data) {
//                    console.log('successfull fetch from neo4j');
//                    console.log(data);
//                    output = data.output;
//                }).error(function (data, status) {
//                    console.log('womp womp, error!');
//                });
//                return [output];
//            },
//
//            /**
//             * Return the most likely input phrase, based on the list of words in the input phrase
//             * @param {Array.<string>} inputWords
//             * @returns {string}
//             */
//            getMostLikelyInputPhrase : function getMostLikelyInputPhrase(inputWords) {
//                var possibleInputPhrases = this.searchForRelatedPhrases(inputWords);
//                return possibleInputPhrases[0];
//            },
//
//            /**
//             * Decide which response abstract phrase [template] is best suited to given input phrase, and return
//             * @example getResponseTemplateForPhrase('how are you') => 'I am {emotion}'
//             * @param {string} phrase
//             * @returns {string}
//             */
//            getResponseTemplateForPhrase : function getResponseTemplateForPhrase(phrase) {
//                return 'wow that is <ratingAdjective>!';
//            },
//
//            /**
//             * Turn abstract response phrase into a specific output, by replacing any keyword or
//             * context variables in the phrase with real words
//             * @example createResponse('this {food} is {adjective}') => 'this turkey is delicious'
//             * @param {string} abstractPhrase
//             * @returns {string}
//             */
//            createResponse : function createResponse(abstractPhrase) {
//                var response = abstractPhrase.replace(keywordRegExp, function(keywordType) {
//                    // remove the <> by slicing first and last character
//                    keywordType = keywordType.slice(1, -1);
//                    return keywordService.getKeywordOfType(keywordType);
//                });
//                return response;
//            },

            /**
             * Determine an appropriate response to input and return comment object
             * @param {string} userInput
             * @returns {Object}
             */
            getResponsePromise : function (userInput) {
//                var inputWords = this.splitPhraseToWords(userInput);
//                var likelyInputPhrase = this.getMostLikelyInputPhrase(inputWords);
//                var outputPhraseTemplate = this.getResponseTemplateForPhrase(likelyInputPhrase);
//                var output = this.createResponse(outputPhraseTemplate);
//                return {type: 'unknown', text: output};

                var deferred = $q.defer();
                var response = {type: 'unknown', text: ''};
                var request = {
                    method: 'GET',
                    url: 'http://localhost:3000/api/respondTo',
                    params: {userInput: userInput}
                };

                $http(request).success(function (data) {
                    response.text = data.output;
                    deferred.resolve(response);
                }).error(function (data, status) {
                    var errMsg = 'womp womp, error!';
                    deferred.reject(errMsg);
                });
                return deferred.promise;
            }
        };
        return conversationServiceInstance;
    }
]);