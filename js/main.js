window.onload = function() {
    var chatInput = $('#chatInput')[0],
        userOutput = $('#user__output div.conversation-container')[0],
        chatbotOutput = $('#bot__output div.conversation-container')[0];

    // Call a polling function to prompt when conversation lags
    poller = new Poller();
    //poller.monitor();

    // Set default chatbot greeting
    botConvo = new Conversation(chatbotOutput);
    botConvo.addLine('Hi Im the chatbot');
    //displayChat(chatbotOutput, chatbotConvo);
    userConvo = new Conversation(userOutput);

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
            userConvo.addLine(chatText);
            //userConvo = updateConvo(userConvo, chatText);
            //displayChat(userOutput, userConvo);
            chatInput.value = '';

            // Display chatbot's response
            getResponsePromise(chatText).then(function(responseText) {
                botConvo.addLine(responseText);
                //chatbotConvo = updateConvo(chatbotConvo, responseText);
                //displayChat(chatbotOutput, chatbotConvo);
            }, function(err) {
                console.log(err);
            });
        };
    }
};

