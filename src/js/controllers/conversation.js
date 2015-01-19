var conversationControllers = angular.module('conversationControllers', []);

conversationControllers.controller('ConversationCtrl', [
    '$q',
    '$scope',
    'keywordService',
    function (
        $q,
        $scope,
        keywordService
    ) {
        // Time settings in milliseconds
        var chatConfig = {
            thinkTime : 0.85 * 1000,
            lullTimeTilPrompt : 20 * 1000
        }
        var lastCommentTime = new Date().getTime();

        $scope.botConvoHistory = ['Hi I\'m the chatbot!'];
        $scope.userInput = '';
        $scope.userConvoHistory = [];

        var getBotResponse = function (userInput) {
            var deferred = $q.defer();

            setTimeout(function() {
                var botOutput = keywordService.getResponse(userInput);
                deferred.resolve(botOutput);
            }, chatConfig.thinkTime);

            return deferred.promise;
        };

        var handleInputComment = function (userInput) {
            var botPromise = getBotResponse(userInput);
            botPromise.then(function (botOutput) {
                $scope.botConvoHistory.push(botOutput);
                $scope.botConvoHistory = $scope.botConvoHistory.slice(-1 * 5);
            })
            $scope.userConvoHistory.push(userInput);
            // @todo - scroll to bottom of history instead of limit lines
            $scope.userConvoHistory = $scope.userConvoHistory.slice(-1 * 5);
            $scope.userInput = '';
        };

        var resetLastComment = function () {
            $scope.userInput = $scope.userConvoHistory.slice(-1)[0];
        };

        $scope.$watch('inputKeyEvent', function (keyEvent) {
            if (angular.isDefined(keyEvent)) {
                switch (keyEvent.keyCode) {
                    case 13: // Enter
                        handleInputComment($scope.userInput);
                        break;
                    case 38: // UP arrow
                        resetLastComment();
                        break;
                }
            }
        });
    }
]);
