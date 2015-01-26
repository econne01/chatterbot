var chatterbotServices = angular.module('chatterbotServices');

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
             * Determine an appropriate response to input and return comment object
             * @param {string} userInput
             * @returns {Object}
             */
            getResponseToInput : function (userInput) {
                var responses;
                var responseType = vocabularyService.getCommentType(userInput);
                if (responseType in vocabularyService.phraseGroups) {
                    responses = vocabularyService.phraseGroups[responseType].keywords;
                } else {
                    responses = ['random response'];
                }
                var responseText = this.chooseRandomItem(responses);
                return {type: responseType, text: responseText};
            }
        };
        return conversationServiceInstance;
    }
]);