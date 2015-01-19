var conversationServices = angular.module('conversationServices', []);

conversationServices.factory('keywordService',
    [function () {
        var hello = ['hello', 'hi', 'hey', 'sup', 'what\'s up', 'yo'];

        var keywordServiceInstance = {
            getResponse : function (userInput) {
                if (hello.indexOf(userInput.text) !== -1) {
                    return {type: 'greeting', text: 'Hi there!!'};
                } else {
                    return {type: 'unknown', text: 'random response'};
                }
            }
        };
        return keywordServiceInstance;
    }
]);