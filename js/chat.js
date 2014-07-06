/**
 * Determine the response of ChatBot based on
 * the given input (ie, chatted text)
 */
var getBotResponse = function(chatText) {
    return 'Wow! My name is chatbot';
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
    var botResponse = getBotResponse(chatInput);

    chatInput.onkeypress = function(e) {
        if (!e) {
            e = window.event;
        };
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Enter key was struck
            displayChat(userOutput, chatInput.value);
            chatInput.value = '';
        };
    }
};
