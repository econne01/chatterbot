'use strict';

// Declare app level module which depends on views, and components
angular.module('botApp', [
    'ngRoute'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/index'});
    $routeProvider.when('/index', {
        templateUrl: 'angular_index.html',
        controller: 'ConversationCtrl'
    });
}])
.controller('ConversationCtrl', [function () {

}]);
