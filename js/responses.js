var Responses = {
    bored: {
        keywords: [],
        phrases: [
            'Hmm, ok',
            'I\'m bored of this',
            'We\'ve been over this',
            '...'
        ]
    },
    greeting: {
        keywords: [
            'hello',
            'hey',
            'hi',
            'sup',
            'what\'s up',
            'yo'
        ],
        phrases: [
            '<greeting> :)',
            'Oh <greeting>',
            'Oh <greeting> <personSlang>',
            '<greeting> <personSlang>',
            '<greeting> there!',
            '<greeting>! How\'s it going?'
        ]
    },
    personSlang: {
        keywords: [
            'brother',
            'dude',
            'man',
            'my man',
            'playa'
        ],
        phrases: []
    },
    pleasantry: {
        keywords: [
            'awesome',
            'cool',
            'good deal',
            'good one',
            'nice',
            'nice one',
            'sick',
            'sweet',
            'wow'
        ],
        phrases: [
            '<pleasantry>',
            '<pleasantry>!',
            'Oh, <pleasantry>'
        ]
    },
    continuePrompt: {
        keywords: [],
        phrases: [
            'Are you there?',
            'Hello?',
            'Tell me when you\'re back',
            'I\'ll just wait here then, shall I?',
            '...',
            'Where did you go?'
        ],
    },
    starterQuestions: {
        keywords: [],
        phrases: [
            'Where are you from?',
            'What do you do for a living?',
            'How is your day going?',
            'What have you been up to lately?',
            'So... how did it go?',
            'So how did you find me here?'
        ],
    },
    answers: {
        keywords: [],
        phrases: [
            'Oh, gosh. I don\'t know.',
            'I wish I knew',
            'Not even Einstein knows that',
            'Around 11 o\'clock, sir',
            'Psh, you know I can\'t tell you that'
        ]
    }
};

var inputComments = {
    'do you like (<input>)\\?*$': {
        acceptedResponses: [
            'I love <input>!',
            '<input>? Are you kidding? I love <input>!'
        ]
    },
    'would you(?: ever)?(<input>)\\?*$': {
        acceptedResponses: [
            'I would never!',
            'I don\'t think so. <input> is scary',
            '<input>? Yeah why not!',
            'Hmm, I would try it',
            'Oh sure, I love <input>!'
        ]
    },
    'have you(?: ever)?(<input>)\\?*$': {
        acceptedResponses: [
            'I would never!',
            'Hmm, I want to',
            'No, but I would try it',
            'No, not yet',
            'Oh sure, I love <input>!'
        ]
    }
};
