/**
 * Constant variables here
 *
 */
var thinkTime = 500, // in milliseconds
    enterTimestamp = new Date().getTime();

var Conversation = function(container, options) {
    if (typeof options === 'undefined') options = {};

    this.maxConvoLines = (typeof options.maxConvoLines !== 'undefined') ? options.maxConvoLines : 5;
    this.convoLines = [];
    this.containerElem = container;
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
};

var UserConversation = function(container, options) {
    return new Conversation(container, options);
};

/**
 * Determine the most appropriate type
 * of response, as listed in the constant
 * list of imported response options
 *
 */
var getResponseType = function(chatText) {
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
 */
var getResponsePromise = function(chatText) {
    var promise = new Promise(function(resolve, reject) {
        var responseType = getResponseType(chatText);

        var randomIndex = Math.floor(Math.random() * Responses[responseType].length);
        var responseText = Responses[responseType][randomIndex];

        // Wait until chatbot is done thinking
        var curTimestamp = new Date().getTime();
        if (curTimestamp - enterTimestamp < thinkTime) {
            setTimeout(function() {}, thinkTime - (curTimestamp - enterTimestamp));
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
