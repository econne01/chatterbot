var db = require('../database');

var WordLiteral = require('seraph-model')(db, 'WordLiteral');

WordLiteral.schema = {
    word: {
        lowercase: true,
        required: true,
        trim: true,
        type: String
    }
};

WordLiteral.setUniqueKey('word', true); // Use existing node on duplicate API calls

module.exports = WordLiteral;