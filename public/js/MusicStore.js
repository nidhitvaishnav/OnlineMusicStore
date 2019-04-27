var app = angular.module('MusicStore', ['ngResource', 'ngRoute']);
var cookie = {};

app.config(['$routeProvider', function($routeProvider, $locationProvider) {
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
        .when('/add-track', {
            templateUrl: 'partials/track-form.html',
            controller: 'AddTrackCtrl'
        })
        .when('/track/editTrack/:id',{
            templateUrl: 'partials/track-form.html',
            controller: 'EditTrackCtrl'
        })
        .when('/track/deleteTrack/:id', {
        templateUrl: 'partials/track-delete.html',
        controller: 'DeleteTrackCtrl'
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
            
            //code for tracks
            var Tracks = $resource('/api/music');//, { search: keyword, criteria: type });
                Tracks.query(function(tracks){
                $scope.tracks = tracks;
            });
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

app.controller('AddTrackCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Tracks = $resource('/api/music');
            Tracks.save($scope.track, function(){
                $location.path('/');
            });
        };
    }]);

app.controller('DeleteTrackCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Tracks = $resource('/api/music/:id');

        Tracks.get({ id: $routeParams.id }, function(track){
            $scope.track = track;
        })

        $scope.delete = function(){
            Tracks.delete({ id: $routeParams.id }, function(track){
                $location.path('/');
            });
        }
    }]);



app.controller('EditTrackCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){   
        var Tracks = $resource('/api/music/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Tracks.get({ id: $routeParams.id }, function(track){
            $scope.track = track;
        });

        $scope.save = function(){
            Tracks.update($scope.track, function(){
                $location.path('/');
            });
        }
    }]);
