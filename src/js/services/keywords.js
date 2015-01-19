var conversationServices = angular.module('conversationServices', []);

conversationServices.factory('keywordService',
    [function () {
        var keywords = {
            greeting : ['hello', 'hi', 'hey', 'sup', 'what\'s up', 'yo']
        };

        var keywordServiceInstance = {

            /**
             * Return a randomly chosen response of given type
             * @param {string | undefined} responseType
             */
            getResponse : function (responseType) {
                if (responseType in keywords) {
                    var responses = keywords[responseType];
                    var randomIndex = Math.floor(Math.random() * responses.length);
                    return {type: responseType, text: responses[randomIndex]};
                } else {
                    return {type: undefined, text: 'random response'};
                }
            },

            respondToInput : function (userInput) {
                if (keywords.greeting.indexOf(userInput.text) !== -1) {
                    return this.getResponse('greeting');
                } else {
                    return this.getResponse('random');
                }
            }
        };
        return keywordServiceInstance;
    }
]);