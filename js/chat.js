/**
 * Constant variables here
 *
 */
var thinkTime = 500; // in milliseconds


/**
 * Determine the response of ChatBot based on
 * the given input (ie, chatted text)
 */
var getResponsePromise = function(chatText) {
    var responseText = 'Wow! My name is chatbot';

    var promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (typeof responseText !== 'null') {
                resolve(responseText);
            } else {
                reject(responseText);
            };
        }, thinkTime);
    });
    return promise;
};

/**
 * Display the chat text in the given conversation container
 */
var displayChat = function(container, chatText) {
    container.innerText = chatText;
};

window.onload = function() {
    var chatInput = $('#chatInput')[0],
        userOutput = $('#user__output div.conversation-container')[0],
        botOutput = $('#bot__output div.conversation-container')[0];

    chatInput.onkeypress = function(e) {
        if (!e) {
            e = window.event;
        };
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter key was struck
            displayChat(userOutput, chatInput.value);
            getResponsePromise(chatInput.value).then(function(responseText) {
                displayChat(botOutput, responseText);
            }, function(err) {
                console.log(err);
            });
            chatInput.value = '';
        };
    }
};
