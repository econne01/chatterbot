window.onload = function() {
    var chatInput = $('#chatInput')[0],
        userOutput = $('#user__output div.conversation-container')[0],
        chatbotOutput = $('#bot__output div.conversation-container')[0];

    // Call a polling function to prompt when conversation lags
    poller = new Poller();
    //poller.monitor();

    // Set default chatbot greeting
    botConvo = new BotConversation(chatbotOutput);
    botConvo.addLine('Hi Im the chatbot');
    userConvo = new UserConversation(userOutput);

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
            botConvo.getResponsePromise(chatText).then(function(responseText) {
                botConvo.addLine(responseText);
            }, function(err) {
                console.log(err);
            });
        };
    }
};

