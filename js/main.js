window.onload = function() {
    var chatInput = $('#chatInput')[0],
        userOutput = $('#user__output div.conversation-container')[0],
        chatbotOutput = $('#bot__output div.conversation-container')[0];

    // Set default chatbot greeting
    userConvo = new UserConversation(userOutput);
    botConvo = new BotConversation(chatbotOutput);
    botConvo.addLine('Hi I\'m the chatbot', 'greeting');
    botConvo.addParticipant(userConvo);

    chatInput.onkeydown = function(e) {
        if (!e) {
            e = window.event;
        };
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            // Display user's comment on Enter
            var chatText = chatInput.value;
            userConvo.addLine(chatText);
            chatInput.value = '';

            // Display chatbot's response
            botConvo.getResponsePromise(chatText).then(function(response) {
                botConvo.addLine(response.text, response.type);
            }, function(err) {
                console.log(err);
            });
        } else if (keyCode == '38') {
            // Show last entered text on Up-Arrow
            chatInput.value = userConvo.getLastLine().text;
        };
    }
};

