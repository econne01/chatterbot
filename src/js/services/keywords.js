var conversationServices = angular.module('conversationServices', []);

conversationServices.factory('keywordService',
    [function () {
        var hello = ['hello', 'hi', 'hey', 'sup', 'what\'s up', 'yo'];

        var keywordServiceInstance = {
            getResponse : function (chatInput) {
                if (hello.indexOf(chatInput) !== -1) {
                    return 'Hi there!!';
                } else {
                    return 'random response';
                }
            }
        };
        return keywordServiceInstance;
    }
]);