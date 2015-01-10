var Keywords = {

    registeredWords: {},

    //hello: ['hello', 'hi', 'hey', 'sup', 'what\'s up', 'yo'],
    dude: ['brother', 'dude', 'man', 'my man', 'playa'],

    register: function (category, keywords) {
        if (!(category in this.registeredWords)) {
            this.registeredWords[category] = [];
        }
        this.registeredWords[category] = this.registeredWords[category].concat(keywords);
    };
};

