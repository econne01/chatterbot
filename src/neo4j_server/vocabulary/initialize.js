var db = require('../database');
var greeting = require('./greeting');
var WordCategory = require('../models/wordCategory');
var WordLiteral = require('../models/wordLiteral');

// To delete datapoints in neo4j
// MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r

var throwDatabaseError = function (err) {
    console.error('Error saving new node to database:', err);
    throw err;
};

var initialize = function initialize() {
    WordCategory.save({category: 'greeting'}, function(err, categoryNode) {
        if (err) throwDatabaseError(err);

        console.log('WordCategory "' + categoryNode.category + '" saved to database with id:', categoryNode.id);
        for (var i in greeting.keywords) {
            WordLiteral.save({word: greeting.keywords[i]}, function(err, wordNode) {
                if (err) throwDatabaseError(err);

                console.log('WordLiteral "' + wordNode.word + '" saved to database with id:', wordNode.id);
                db.relationships(wordNode, function(err, rels) {
                    var categoryRelExists = false;
                    rels.forEach(function(relationship) {
                        if (relationship.end === categoryNode.id) {
                            categoryRelExists = true;
                        }
                    });
                    if (!categoryRelExists) {
                        db.relate(wordNode, 'isWordCategory', categoryNode, function(err, relationship) {
                            // Nothing to do yet
                            console.log('created new relationship for "' + wordNode.word + '"');
                        });
                    }
                });
            });
        }
    });
};

module.exports = initialize;