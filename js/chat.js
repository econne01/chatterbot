/**
 * Constant variables here
 *
 */
var thinkTime = 500, // in milliseconds
    enterTimestamp = new Date().getTime(),
    maxConvoLines = 5,
    userConvo = [],
    chatbotConvo = ['Hi! My name is chatbot, what is your name?'];


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

var updateConvo = function(convo, chatText) {
    convo.push(chatText);
    if (convo.length > maxConvoLines) {
        convo = convo.slice(1, maxConvoLines+1);
    };
    return convo;
};

/**
 * Display the chat text in the given conversation container
 */
var displayChat = function(container, convo) {
    container.innerHTML = convo.join('<br/>');
};

window.onload = function() {
    var chatInput = $('#chatInput')[0],
        userOutput = $('#user__output div.conversation-container')[0],
        chatbotOutput = $('#bot__output div.conversation-container')[0];

    // Set default chatbot greeting
    displayChat(chatbotOutput, chatbotConvo);

    chatInput.onkeypress = function(e) {
        if (!e) {
            e = window.event;
        };
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter key was struck
            enterTimestamp = new Date().getTime();
            // Display user's comment
            var chatText = chatInput.value;
            userConvo = updateConvo(userConvo, chatText);
            displayChat(userOutput, userConvo);
            chatInput.value = '';

            // Display chatbot's response
            getResponsePromise(chatText).then(function(responseText) {
                chatbotConvo = updateConvo(chatbotConvo, responseText);
                displayChat(chatbotOutput, chatbotConvo);
            }, function(err) {
                console.log(err);
            });
        };
    }
};
