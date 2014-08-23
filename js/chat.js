/**
 * Global variables
 *
 */
// ex, 'test <input> phrase' matches '<input>'
var keywordRegEx = /[^\\]{0,0}<[\w]+[^\\]{0,0}>/g;

/**
 * Generic conversation class
 *
 */
var Conversation = function(container, options) {
    this.init(this, container, options);
};

Conversation.prototype.init = function(container, options) {
    if (typeof options === 'undefined') options = {};

    this.maxDisplayLines = (typeof options.maxDisplayLines !== 'undefined') ? options.maxDisplayLines : 5;
    this.maxHistoryLines = (typeof options.maxHistoryLines !== 'undefined') ? options.maxHistoryLines : 100;
    this.convoLines = [];
    this.containerElem = container;
    this.lastCommentTime = new Date().getTime();
};

/**
 * Add a line to this conversation history
 * @param String chatText - the text to output
 * @param String type - the index key of Responses set, specifies a category of text
 *
 */
Conversation.prototype.addLine = function(chatText, type) {
    var self = this;
    if (chatText == null || chatText == '') {
        return;
    };

    // Update the conversation with new line
    self.convoLines.push({
        type: type,
        text: chatText
    });
    if (self.convoLines.length > self.maxHistoryLines) {
        self.convoLines = self.convoLines.slice(-1 * self.maxHistoryLines);
    };
    // Display the conversation in Container
    var textLines = [],
        lines = self.convoLines.slice(-1 * self.maxDisplayLines);
    for (var i=0; i < lines.length; i++) {
        textLines.push(lines[i].text);
    };
    self.containerElem.innerHTML = textLines.join('<br/>');

    // Update last commented time
    self.lastCommentTime = new Date().getTime();
};

/**
 * User Conversation logic
 *
 */
var UserConversation = function(container, options) {
    this.init(container, options);
};

// Extend Converation functions
UserConversation.prototype.init = Conversation.prototype.init;
UserConversation.prototype.addLine = Conversation.prototype.addLine;

/**
 * Bot Conversation logic
 *
 */
var BotConversation = function(container, options) {
    this.init(container, options);
    this.userConversation = null;
    this.thinkTime = 1.5 * 1000; // in milliseconds
    this.lullTimeTilPrompt = 20 * 1000; // in milliseconds
    this.pollFrequency = 5 * 1000 // in milliseconds
};

// Extend Converation functions
BotConversation.prototype.init = Conversation.prototype.init;
BotConversation.prototype.addLine = Conversation.prototype.addLine;

/**
 * Add a user conversation to be a participant in
 * speaking with this Bot
 *
 */
BotConversation.prototype.addParticipant = function(userConvo) {
    this.userConversation = userConvo;
    this.monitorLulls();
};

/**
 * Begin polling for lapses in the conversation
 * If user has not spoken for a while, prompt him/her
 *
 */
BotConversation.prototype.monitorLulls = function() {
    var self = this;

    setTimeout(function() {
        var curTime = new Date().getTime();
        if (self.userConversation !== null
                && (curTime - self.userConversation.lastCommentTime > self.lullTimeTilPrompt)
                && (curTime - self.lastCommentTime > self.lullTimeTilPrompt)) {
            self.promptConversation();
        };
        if (self.userConversation !== null) {
            // Poll again
            self.monitorLulls();
        };
    }, self.pollFrequency);
};

/**
 * Get a random choice of the given list
 *
 */
BotConversation.prototype.randomChoice = function(list) {
    if (typeof list === 'undefined' || list.length === 0) {
        return null;
    };

    return list[Math.floor(Math.random() * list.length)];
};

/**
 * Get a random response keyword for given response type
 *
 */
BotConversation.prototype.getKeyword = function(type) {
    if (typeof Responses[type] === 'undefined') {
        return '';
    };

    return this.randomChoice(Responses[type].keywords);
};

/**
 * Get a random response type from given
 * available types, but do not choose one of
 * the excluded types
 *
 */
BotConversation.prototype.getRandomResponseType = function(availTypes, excludeTypes) {
    // Get all avail types that are not excluded
    var types = availTypes.filter(function(type) {
        return excludeTypes.indexOf(type) === -1;
    });
    return this.randomChoice(types);
};

/**
 * Determine the most appropriate type of response,
 * as listed in the constant list of imported response options
 * @return String responseType, or null (for silence)
 *
 */
BotConversation.prototype.getResponseType = function(chatText) {
    var self = this,
        responseType = null;

    var types = Object.keys(Responses).filter(function(type) {
        // Only include Response Types with any avail phrases
        return Responses[type].phrases.length > 0;
    })
    //types = types.concat([null]);

    if (self.checkForKeyword(chatText, 'greeting')) {
        // If being greeted, greet in response. Max of 2 times
        var maxTries = 2,
            recentLines = this.convoLines.slice(-1 * maxTries);
        var greetings = recentLines.filter(function(convoLine) {
            return convoLine.type === 'greeting';
        });
        responseType = greetings.length < maxTries ? 'greeting' : 'bored';
    } else if (chatText.slice(-1) === '?') {
        // If last character of text is '?', we need to answer
        responseType = 'answers';
    } else if (chatText.slice(-3) === '...') {
        responseType = null;
    } else {
        // Dont randomly say an Answer or Continue Conversation prompt
        responseType = self.getRandomResponseType(types, ['answers', 'bored', 'continuePrompt', 'greeting']);
    };
    return responseType;
};

/**
 * Determine the response of ChatBot based on
 * the given input (ie, chatted text)
 * @return Promise
 */
BotConversation.prototype.getResponsePromise = function(chatText) {
    var self = this;

    var promise = new Promise(function(resolve, reject) {
        var responseText = self.getStructuredInputResponse(chatText);

        if (!responseText) {
            var responseType = self.getResponseType(chatText);

            if (responseType === null) {
                responseText = null;
            } else {
                responseText = self.createResponse(self.randomChoice(Responses[responseType].phrases));
            };
        };

        // Wait until chatbot is done thinking
        var curTimestamp = new Date().getTime();
        var waitTime = self.thisTime - (curTimestamp - self.userConversation.lastCommentTime);
        waitTime = (waitTime > 0) ? waitTime : 0;

        setTimeout(function() {
            // Now complete the promise
            if (typeof responseText !== 'null') {
                resolve({
                    text: responseText,
                    type: responseType
                });
            } else {
                reject(responseText);
            };
        }, waitTime);

    });
    return promise;
};

/**
 * Check given text for a recognized keyword of given type
 *
 */
BotConversation.prototype.checkForKeyword = function(chatText, type) {
    if (typeof Responses[type] === 'undefined') {
        return false;
    };

    var words = chatText.replace(/[,.?!()&]/g, '').split(' ');
    for (var i=0; i < words.length; i++) {
        if (Responses[type].keywords.indexOf(words[i]) !== -1) {
            return true;
        };
    };
    return false;
};

/**
 * Check the list of known input comment structures to see
 * if this one matches any. If so, create the response text,
 * else return null
 *
 */
BotConversation.prototype.getStructuredInputResponse = function(chatText) {
    var self = this,
        keywordVariableList = [],
        commentRegExp;

    for (var comment in inputComments) {
        commentRegExp = RegExp(comment.replace(keywordRegEx, function(match) {
            keywordVariableList.push(match);
            // Use the non-greedy wildcard syntax
            return '.+';
        }));

        if (chatText.search(commentRegExp) > -1) {
            var answer = self.randomChoice(inputComments[comment].acceptedResponses);
            var inputVars = chatText.match(commentRegExp).slice(1);

            for (var i=0; i<keywordVariableList.length; i++) {
                // Use RegExp with param 'g' to replace all (global) occurrences of keyword
                answer = answer.replace(RegExp(keywordVariableList[i], 'g'), inputVars[i]);
            };
            return answer;
        };
    };
    return null;
};

/**
 * Compile the response text based on the given abstract phrase,
 * after replacing any keywords in phrase as needed
 *
 * @param String abstractPhrase (eg. '<greeting> to you!')
 */
BotConversation.prototype.createResponse = function(abstractPhrase) {
    var self = this;

    // keyword should match any <greeting> but not escaped bracket (ie \\<word\\>)
    return abstractPhrase.replace(keywordRegEx, function(match) {
        // Remove <,> and whitespace from matched 'type'
        return (match[0] == '<' ? '' : match[0]) + self.getKeyword(match.replace(/[<>\s]/g,''));
    });
};

/**
 * Make a comment to prompt further conversation
 *
 */
BotConversation.prototype.promptConversation = function() {
    var responseType = 'continuePrompt',
        responseText = this.randomChoice(Responses[responseType]);

    // Do not keep trying after 2 repeated attempts
    var makeComment = false,
        attempts = 2;
    var recentLines = this.convoLines.slice(-1*attempts);
    recentLines.reverse();
    for (var i=0; i < attempts; i++) {
        if (recentLines.length >= i && recentLines[i].type !== responseType) {
            makeComment = true;
            break;
        };
    };
    if (makeComment) {
        this.addLine(responseText, responseType);
    };
};
