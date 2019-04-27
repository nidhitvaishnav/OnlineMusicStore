var app = angular.module('auth-node', ['ngResource', 'ngRoute']);
var cookie = {};

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        })
        .when('/test', {
            templateUrl: 'partials/test.html',
            controller: 'testCtrl'
        })
        .when('/logout', {
            templateUrl: 'partials/home.html',
            controller: 'logoutCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// Home Page
app.controller('homeCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            console.log('logged In');
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
        }
        else {
            $scope.loggedIn = 'no';
        }
    }
]);

// Register Page
app.controller('registerCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location) {
        $scope.register = function() {
            var Users = $resource('/api/users');
            var data = {
                'user': {
                    'fname': $scope.user.fname,
                    'lname': $scope.user.lname,
                    'email': $scope.user.email,
                    'password': $scope.user.password
                }
            };
            Users.save(data, function() {
                $location.path('/');
            });
        };
    }
]);

// Login Page
app.controller('loginCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        var thisWindow = $window;
        $scope.login = function() {

            var Users = $resource('/api/users/login');
            var data = {
                'user': {
                    'email': $scope.user.email,
                    'password': $scope.user.password
                }
            };
            Users.save(data, function(token) {
                if (token['error']) {
                    console.log('Invalid Login Credentials');
                } else {
                    var user = token['user'];
                    $window.localStorage.setItem('loggedIn', "yes");
                    $window.localStorage.setItem('userID', user['_id']);
                    $window.localStorage.setItem('userEmail', user['email']);
                    $window.localStorage.setItem('userToken', user['token']);
                    $location.path('/');
                }
            });
        };
    }
]);

// Logout Page
app.controller('logoutCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $scope.loggedIn = 'no';
            $window.localStorage.setItem('userID', '');
            $window.localStorage.setItem('userEmail', '');
            $window.localStorage.setItem('userToken', '');
        }
        else {
            $scope.errors = "Not Logged In";
        }
    }
]);

// Test page
app.controller('testCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            console.log('logged In');
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
        }
        else {
            $scope.errors = "Not Logged In";
        }
    }
]);
