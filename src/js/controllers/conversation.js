var conversationControllers = angular.module('conversationControllers', []);

conversationControllers.controller('ConversationCtrl', [
    '$q',
    '$scope',
    'conversationService',
    function (
        $q,
        $scope,
        conversationService
    ) {
        // Time settings in milliseconds
        var chatConfig = {
            lullTimeTilPrompt : 20 * 1000,
            thinkTime : 0.85 * 1000,
            maxPromptAttempts : 2
        }
        var lastCommentTime = new Date().getTime();

        $scope.botConvoHistory = ['Hi I\'m the chatbot!'];
        $scope.userInput = '';
        $scope.userConvoHistory = [];

        /**
         * Determine the chatBot's response to a user input and return
         * a promise to yield chatBot's response
         * @param {string} userInput
         * @returns promise
         */
        var getBotResponse = function (userInput) {
            var deferred = $q.defer();

            setTimeout(function() {
                var botOutput = conversationService.getResponseToInput(userInput);
                deferred.resolve(botOutput);
            }, chatConfig.thinkTime);

            return deferred.promise;
        };


        /**
         * Set the given comment to either user or bot history and then monitor
         * if conversation lulls
         * @param {string} convoHistory - either bot's or user's
         * @param {Object} comment - eg, {type: 'greeting', text: 'Hey'}
         */
        var _setResponse = function (convoHistory, comment) {
            $scope[convoHistory].push(comment);
            $scope[convoHistory] = $scope[convoHistory].slice(-1 * 5);
            lastCommentTime = new Date().getTime();

            // Check for lulls in conversation following this comment
            monitorLulls();
        };

        var setBotResponse = function (botOutput) {
            _setResponse('botConvoHistory', botOutput);
        };

        /**
         * Set user's comment in history and clear the user's chat input to
         * allow new comment
         * @param {string} userText
         */
        var setUserResponse = function (userText) {
            var userInput = {type: undefined, text: userText};
            // @todo - scroll to bottom of history instead of limit lines
            $scope.userInput = '';
            _setResponse('userConvoHistory', userInput);
        };

        /**
         * Determine bot response and update the user and bot comment histories,
         * and handle any resulting effects of the comment or subsequent lulls
         * @param {string} userText
         */
        var respondToUserComment = function (userText) {
            var botPromise = getBotResponse(userText);
            botPromise.then(setBotResponse);
        };

        /**
         * Check conversation history to see if user has stopped entering comments
         * After a lull in conversation, prompt user to continue chatting
         */
        var monitorLulls = function () {
            var lullStartTime = new Date().getTime();
            setTimeout(function() {
                var isBored = lullStartTime >= lastCommentTime;
                if (isBored) {
                    promptConversation();
                }
            }, chatConfig.lullTimeTilPrompt);
        };

        /**
         * Bot will make a prompting comment to suggest user continues the conversation
         */
        var promptConversation = function () {
            // Do not keep trying after too many repeated attempts
            var prevComments = $scope.botConvoHistory.slice(-1 * chatConfig.maxPromptAttempts);
            var givenUp = prevComments.reduce(function (isPromptType, line) {
                return isPromptType && line.type === 'continuePrompt';
            }, true);

            if (!givenUp) {
                var responseText = 'Hello? Where did you go?';
                setBotResponse({type: 'continuePrompt', text: responseText});
            }
        };

        /**
         * Convenience method to let user repeat his previous comment easily
         * by hitting up arrow (as in terminal)
         */
        var resetLastComment = function () {
            var lastComment = $scope.userConvoHistory.slice(-1)[0];
            if (lastComment) {
                $scope.userInput = lastComment.text;
            }
        };

        $scope.$watch('inputKeyEvent', function (keyEvent) {
            if (angular.isDefined(keyEvent)) {
                switch (keyEvent.keyCode) {
                    case 13: // Enter
                        var userText = $scope.userInput;
                        setUserResponse(userText);
                        respondToUserComment(userText);
                        break;
                    case 38: // UP arrow
                        resetLastComment();
                        break;
                }
            }
        });
    }
]);
