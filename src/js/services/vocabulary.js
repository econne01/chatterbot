var chatterbotServices = angular.module('chatterbotServices');

chatterbotServices.factory('vocabularyService', [
    'vocabularyConstants.affirmative',
    'vocabularyConstants.greeting',
    'vocabularyConstants.personSlang',
    'vocabularyConstants.random',
    function (
        affirmative,
        greeting,
        personSlang,
        random
    ) {
        // Note 'g' denotes global: we always find all instances of RegExp in a string
        var keywordRegExp = RegExp('<[\\w]+>', 'g');
        var keyPhraseRegex = RegExp('{[\\w]+}', 'g');
        var optionalRegex = RegExp('\\[.+?\\]', 'g'); // .+? is a non-greedy regExp

        var vocabularyServiceInstance = {
            phraseGroups : {
                affirmative : affirmative,
                greeting : greeting,
                personSlang : personSlang,
                random : random
            },

            /**
             * Set keyword and key-phrase regular expressions for each available phraseGroup
             * to use as cached values to reduce run-time calculations
             */
            updatePhraseGroupRegExps : function updateGroupRegExps() {
                var self = this;
                for (var phraseGroup in this.phraseGroups) {
                    var keywords = this.phraseGroups[phraseGroup].keywords;
                    this.phraseGroups[phraseGroup].keywordRegExp = RegExp('(' + keywords.join('|') + ')');
                }
                for (phraseGroup in this.phraseGroups) {
                    var phrases = this.phraseGroups[phraseGroup].phrases;
                    if (angular.isDefined(phrases)) {
                        phrases = phrases.map(function (phrase) {
                            // Replace all optional text with the syntax for optional RegExp
                            phrase = phrase.replace(optionalRegex, function(optionalText) {
                                // remove the [] by slicing first and last character
                                optionalText = optionalText.slice(1, -1);
                                return '(?:' + optionalText + ')?';
                            });
                            // Replace all keyword placeholders with chooseOneKeyword regular expression
                            phrase = phrase.replace(keywordRegExp, function(keywordType) {
                                // remove the <> by slicing first and last character
                                keywordType = keywordType.slice(1, -1);
                                return self.phraseGroups[keywordType].keywordRegExp.source;
                            });
                            return '(' + phrase.toLowerCase() + ')';
                        });
                        this.phraseGroups[phraseGroup].phraseRegExp = RegExp('^(' + phrases.join('|') + ')$');
                    }
                }
            },

            /**
             * Determine if word matches any keyword of the given context type
             * @param {string} phraseType
             * @param {string} word
             * @returns {boolean}
             */
            isKeywordMatch : function isKeywordMatch(phraseType, word) {
                return this.phraseGroups[phraseType].keywords.indexOf(word) !== -1;
            },

            /**
             * Determine if comment matches any comment phrase structure of the given type
             * @param {string} phraseType
             * @param {string} comment
             * @returns {boolean}
             */
            isPhraseMatch : function isPhraseMatch(phraseType, comment) {
                var phraseGroup = this.phraseGroups[phraseType];
                if (angular.isDefined(phraseGroup.phraseRegExp)) {
                    return phraseGroup.phraseRegExp.test(comment.toLowerCase());
                }
                return false;
            },

            /**
             * Determine the type of comment by searching for context clues in the comment.
             * Return the type
             * @param {string} comment
             * @returns {string} - the type of comment
             */
            getCommentType : function getCommentType(comment) {
                for (var phraseType in this.phraseGroups) {
                    if (this.isPhraseMatch(phraseType, comment)) {
                        return phraseType;
                    }
                }
                return 'random';
            }

        };
        vocabularyServiceInstance.updatePhraseGroupRegExps();
        return vocabularyServiceInstance;
    }
]);
