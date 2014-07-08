/**
 * Generic conversation class
 *
 */
var Conversation = function(container, options) {
    this.init(this, container, options);
};

Conversation.prototype.init = function(container, options) {
    if (typeof options === 'undefined') options = {};

    this.maxConvoLines = (typeof options.maxConvoLines !== 'undefined') ? options.maxConvoLines : 5;
    this.convoLines = [];
    this.containerElem = container;
    this.lastCommentTime = new Date().getTime();
};

Conversation.prototype.addLine = function(chatText) {
    var self = this;
    // Update the conversation with new line
    self.convoLines.push(chatText);
    if (self.convoLines.length > self.maxConvoLines) {
        self.convoLines = self.convoLines.slice(1, self.maxConvoLines+1);
    };
    // Display the conversation in Container
    self.containerElem.innerHTML = self.convoLines.join('<br/>');
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
    this.thinkTime = 500; // in milliseconds
};

// Extend Converation functions
BotConversation.prototype.init = Conversation.prototype.init;
BotConversation.prototype.addLine = Conversation.prototype.addLine;

/**
 * Determine the most appropriate type
 * of response, as listed in the constant
 * list of imported response options
 *
 */
BotConversation.prototype.getResponseType = function(chatText) {
    var types = Object.keys(Responses);

    if (chatText.slice(-1) === '?') {
        // If last character of text is '?', we need to answer
        return 'answers';
    } else {
        types.splice(types.indexOf('answers'), 1);
    };
    return types[Math.floor(Math.random() * types.length)];
};

/**
 * Determine the response of ChatBot based on
 * the given input (ie, chatted text)
 * @return Promise
 */
BotConversation.prototype.getResponsePromise = function(chatText) {
    var self = this;

    var promise = new Promise(function(resolve, reject) {
        var responseType = self.getResponseType(chatText);

        var randomIndex = Math.floor(Math.random() * Responses[responseType].length);
        var responseText = Responses[responseType][randomIndex];

        // Wait until chatbot is done thinking
        var curTimestamp = new Date().getTime();
        if (curTimestamp - self.lastCommentTime < self.thinkTime) {
            setTimeout(function() {}, self.thinkTime - (curTimestamp - self.lastCommentTime));
        };

        // Now complete the promise
        if (typeof responseText !== 'null') {
            resolve(responseText);
        } else {
            reject(responseText);
        };
    });
    return promise;
};
