var chatterbotServices = angular.module('chatterbotServices');

// keywordRegEx should match any "<greeting>" but not escaped bracket (ie \\<greeting\\>)
// ex, 'test <input> phrase' matches '<input>'
var keywordRegEx = /[^\\]{0,0}<[\w]+[^\\]{0,0}>/g;
var optionalRegEx = /[^\\]{0,0}\[.+[^\\]{0,0}\]/g;

chatterbotServices.factory('conversationService', [
    'vocabularyService',
    function (
        vocabularyService
    ) {
        var conversationServiceInstance = {

            /**
             * Select an item from given list at random, and return
             * @param {Array} itemList
             * @returns {Object} - an item from given list
             */
            chooseRandomItem : function chooseRandomItem(itemList) {
                var randomIndex = Math.floor(Math.random() * itemList.length);
                return itemList[randomIndex];
            },

            /**
             * Randomly choose a response phrase format (from constants file)
             * for the given responseType and then randomly select any specifics
             * to replace the regex within response phrase format.
             * @param {string} responseType
             * @returns {string} the bot's response text
             * @example generateResponse('greeting') => 'hi'
             * @example generateResponse('greeting') => 'yo bro!'
             */
            generateResponse : function generateResponse(responseType) {
                var self = this,
                    responseConstants = vocabularyService.phraseGroups[responseType];

                // the default response format is a single word, chosen from keywords
                // of the given responseType. (eg, greeting=>'hey' or personSlang=>'man')
                var phraseFormat = '<' + responseType + '>';
                if (responseConstants.phrases) {
                    phraseFormat = this.chooseRandomItem(responseConstants.phrases);
                }

                // TODO: Replace any generic format '{phrase}'s with specifics
                // Determine if bracketed [optional] phrase components will be used
                var response = phraseFormat.replace(optionalRegEx, function(match) {
                    // Remove [,] and whitespace from matched optional response component
                    var optionalComponent = match.slice(1,-1).replace(/\s/g,'');
                    return Math.random() >= 0.5 ? optionalComponent : '';
                });

                // Replace any generic format '<keyword>'s with specifics
                response = response.replace(keywordRegEx, function(genericKeyword) {
                    // Remove <,> and whitespace from matched 'type'
                    var keywordType = genericKeyword.replace(/[<>\s]/g,'');
                    return self.chooseRandomItem(vocabularyService.phraseGroups[keywordType].keywords);
                });
                return response;
            },

            /**
             * Determine an appropriate response to input and return comment object
             * @param {string} userInput
             * @returns {Object}
             */
            getResponseToInput : function (userInput) {
                var responseText;
                var responseType = vocabularyService.getCommentType(userInput);
                if (!(responseType in vocabularyService.phraseGroups)) {
                    responseType = 'random';
                }
                responseText = this.generateResponse(responseType);
                return {type: responseType, text: responseText};
            }
        };
        return conversationServiceInstance;
    }
]);