var db = require('../database');

var WordCategory = require('seraph-model')(db, 'WordCategory');

WordCategory.schema = {
    category: {
        lowercase: true,
        required: true,
        trim: true,
        type: String
    }
};

WordCategory.setUniqueKey('category', true); // Use existing node on duplicate API calls

module.exports = WordCategory;