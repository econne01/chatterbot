window.onload = function() {
    var chatInput = $('#chatInput')[0],
        userOutput = $('#user__output div.conversation-container')[0],
        chatbotOutput = $('#bot__output div.conversation-container')[0];

    // Set default chatbot greeting
    userConvo = new UserConversation(userOutput);
    botConvo = new BotConversation(chatbotOutput);
    botConvo.addLine('Hi Im the chatbot');
    botConvo.addParticipant(userConvo);

    chatInput.onkeypress = function(e) {
        if (!e) {
            e = window.event;
        };
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Display user's comment
            var chatText = chatInput.value;
            userConvo.addLine(chatText);
            chatInput.value = '';

            // Display chatbot's response
            botConvo.getResponsePromise(chatText).then(function(responseText, responseType) {
                botConvo.addLine(responseText, responseType);
            }, function(err) {
                console.log(err);
            });
        };
    }
};

