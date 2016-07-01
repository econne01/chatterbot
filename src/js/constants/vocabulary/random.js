var vocabularyConstants = angular.module('vocabularyConstants');

/**
 * How to write Vocabulary Constants file:
 *     keywords:
 *         a list of literals (one or more words) that indicate a
 *         comment has context of this group of vocabulary words.
 *     phrases:
 *         list of possible comment structures that belong to this vocab group
 *
 * - Apostrophes in user input are always optional (ie, ignored)
 * - Extra whitespace in user input is always ignored
 * - Exclamations in user input have no bearing on content types (but can affect implied emotion)
 * - In "phrases" list, angled brackets <> denote a keyword of <type>
 * - In "phrases" list, square brackets [] denote optional input
 * - In "phrases" list, curly brackets {} denote a phrase of {type}
 */
vocabularyConstants.constant('vocabularyConstants.random', {
    'keywords': [
        'er',
        'what',
        'crazy',
        'wow',
        'whoa'
    ],
    'phrases': [
        '<random>'
    ]
});