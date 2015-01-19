var conversationControllers = angular.module('conversationControllers', []);

conversationControllers.controller('ConversationCtrl', [
    '$scope',
    'keywordService',
    function (
        $scope,
        keywordService
    ) {
        $scope.botConvoHistory = ['Hi I\'m the chatbot!'];
        $scope.userInput = '';
        $scope.userConvoHistory = [];

        $scope.handleInputComment = function (userInput) {
            var botOutput = keywordService.getResponse(userInput);
            $scope.botConvoHistory.push(botOutput);
            $scope.userConvoHistory.push(userInput);
            // @todo - scroll to bottom of history instead of limit lines
            $scope.botConvoHistory = $scope.botConvoHistory.slice(-1 * 5);
            $scope.userConvoHistory = $scope.userConvoHistory.slice(-1 * 5);
            $scope.userInput = '';
        };

        $scope.resetLastComment = function () {
            $scope.userInput = $scope.userConvoHistory.slice(-1)[0];
        };

        $scope.$watch('inputKeyEvent', function (keyEvent) {
            if (angular.isDefined(keyEvent)) {
                switch (keyEvent.keyCode) {
                    case 13: // Enter
                        $scope.handleInputComment($scope.userInput);
                        break;
                    case 38: // UP arrow
                        $scope.resetLastComment();
                        break;
                }
            }
        });
    }
]);
