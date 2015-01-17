chatterbotApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/index', {
            templateUrl: 'src/angular_index.html',
            controller: 'ConversationCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/index'});
    }
]);