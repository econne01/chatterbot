'use strict';

// Declare app level module which depends on views, and components
var chatterbotApp = angular.module('chatterbotApp', [
    'ngRoute',
    'conversationControllers',
    'chatterbotServices',
    'vocabularyConstants'
]);

var chatterbotServices = angular.module('chatterbotServices', []);
var vocabularyConstants = angular.module('vocabularyConstants', []);
