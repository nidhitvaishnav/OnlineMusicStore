var app = angular.module('MusicStore', ['ngResource', 'ngRoute']);
var cookie = {};

app.config(['$routeProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
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
        .when('/favorites', {
            templateUrl: 'partials/favorites.html',
            controller: 'favoritesCtrl'
        })
        .when('/add-track', {
            templateUrl: 'partials/track-form.html',
            controller: 'AddTrackCtrl'
        })
        .when('/track/editTrack/:id', {
            templateUrl: 'partials/track-form.html',
            controller: 'EditTrackCtrl'
        })
        .when('/track/deleteTrack/:id', {
            templateUrl: 'partials/track-delete.html',
            controller: 'DeleteTrackCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

// Home Page
app.controller('homeCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
            $scope.isAdmin = $window.localStorage.getItem('is_admin');

            $scope.currentPage = 0;
            $scope.pageSize = 4;
            $scope.tracks = [];
            $scope.numberOfPages=function(){
                return Math.ceil($scope.tracks.length/$scope.pageSize);                
            }
            //code for tracks
            var Tracks = $resource('/api/music'); //, { search: keyword, criteria: type });
            Tracks.query(function(tracks) {
                for (var i of tracks) {
                    $scope.tracks.push(i);
                }
            });
        } else {
            $location.path('/login');
        }
        $scope.like = function(id) {
            var Like = $resource('/api/music/like');
            var data = {
                'userID': $window.localStorage.getItem('userID'),
                'trackID': id
            };
            // console.log("data: ", data);
            Like.save(data, function(res) {
                // console.log("inside Like.save()");
                console.log(res);
                $location.path('/home');
            });
        }
    }
]);

    app.filter('startFrom', function() {
        return function(tracks, start) {
            // for (var i of tracks){
            //     console.log("printing tracks:", i);
            // }
            start = +start; //parse to int
            return tracks.slice(start);
        }
    });

app.filter('filter',function(){
    return function(tracks, genreFilter){
        if (!genreFilter || genreFilter=="All"){
            return tracks;
        }
        else{
            var newTracks = [];
            var genreFilter = genreFilter.toLowerCase();
            console.log("GenreFilter: ", genreFilter);
            for (var i of tracks){
                if(checkGenre(i.genre, genreFilter)){
                    newTracks.push(i);
                }
            }
            // loop through genres checking if 'genreFilter' exists
            function checkGenre(genre, genreFilter) {
              for (var g of genre) {
                if (g.toLowerCase().indexOf(genreFilter) > -1) {
                  return true;
                }
              }
              return false;
            }
            return newTracks;

        }
    }
});

app.filter('search', function() {
    return function(tracks, keyword) {
      // if no keyword is entered, just display all the tracks
      if (!keyword) { 
        return tracks; 
      } 
      else {
        var newTracks = [];
        var keyword = keyword.toLowerCase();
        console.log("Keyword: ", keyword);
        // for (var i of tracks){
        //     if(typeOf(i.title)!='undefined'){
        //     console.log("typeOf: ", i.title, ":", (i.title.toLowerCase()));}
        // }
        // create new set of tracks where 'keyword' exists in object data
        for (var i of tracks) {
          if (i.title.toLowerCase().indexOf(keyword) > -1 || 
              i.album.toLowerCase().indexOf(keyword) > -1 || 
              checkArtist(i.artist, keyword)) { newTracks.push(i); }
        }

        // loop through artist checking if 'keyword' exists
        function checkArtist(artist, keyword) {
          for (var a of artist) {
            if (a.toLowerCase().indexOf(keyword) > -1) {
              return true;
            }
          }
          return false;
        }
        return newTracks;
      }
    };
  });

// Register Page
app.controller('registerCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        $scope.loggedIn = $window.localStorage.getItem('loggedIn');
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
                $location.path('/home');
            });
        };
    }
]);

// Login Page
app.controller('loginCtrl', ['$scope', '$resource', '$location', '$window', '$http',
    function($scope, $resource, $location, $window, $http) {
        var thisWindow = $window;
        $scope.loggedIn = $window.localStorage.getItem('loggedIn');
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

                    var userAdminLink = {
                        url: '/api/users/is_admin',
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + user['token']
                        }
                    };

                    $http(userAdminLink).then(function(response) {
                        var adminStatus = response['data']['is_admin'];
                        $window.localStorage.setItem('loggedIn', "yes");
                        $window.localStorage.setItem('userID', user['_id']);
                        $window.localStorage.setItem('is_admin', adminStatus);
                        $window.localStorage.setItem('userEmail', user['email']);
                        $window.localStorage.setItem('userToken', user['token']);
                        $location.path('/home');
                    });
                }
            });
        };
    }
]);

// Logout Page
app.controller('logoutCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $window.localStorage.setItem('loggedIn', 'no');
            $window.localStorage.setItem('userID', '');
            $window.localStorage.setItem('userEmail', '');
            $window.localStorage.setItem('userToken', '');
            $location.path('/login');
        } else {
            $scope.errors = "Not Logged In";
            $location.path('/login');
        }
    }
]);

// Test page
app.controller('testCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.isAdmin = $window.localStorage.getItem('is_admin');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
        } else {
            $scope.errors = "Not Logged In";
        }
    }
]);

// Add Track page
app.controller('AddTrackCtrl', ['$scope', '$resource', '$location', '$window',
    function($scope, $resource, $location, $window) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.isAdmin = $window.localStorage.getItem('is_admin');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
            $scope.save = function() {
                var Tracks = $resource('/api/music');
                Tracks.save($scope.track, function() {
                    $location.path('/home');
                });
            };
        } else {
            $location.path('/home');
        }
    }
]);

// Delete Track Page
app.controller('DeleteTrackCtrl', ['$scope', '$resource', '$location', '$routeParams', '$window',
    function($scope, $resource, $location, $routeParams, $window) {

        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.isAdmin = $window.localStorage.getItem('is_admin');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
            var Tracks = $resource('/api/music/:id');

            Tracks.get({
                id: $routeParams.id
            }, function(track) {
                $scope.track = track;
            })

            $scope.delete = function() {
                Tracks.delete({
                    id: $routeParams.id
                }, function(track) {
                    $location.path('/home');
                });
            }
        } else {
            $location.path('/home');
        }
    }
]);

// Edit Track Page
app.controller('EditTrackCtrl', ['$scope', '$resource', '$location', '$routeParams', '$window',
    function($scope, $resource, $location, $routeParams, $window) {

        if ($window.localStorage.getItem('loggedIn') == 'yes') {
            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.isAdmin = $window.localStorage.getItem('is_admin');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');

            var Tracks = $resource('/api/music/:id', {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });

            Tracks.get({
                id: $routeParams.id
            }, function(track) {
                $scope.track = track;
            });

            $scope.save = function() {
                Tracks.update($scope.track, function() {
                    $location.path('/home');
                });
            }
        } else {
            $location.path('/home');
        }
    }
]);

// Favorites Page
app.controller('favoritesCtrl', ['$scope', '$resource', '$location', '$window', '$http',
    function($scope, $resource, $location, $window, $http) {
        if ($window.localStorage.getItem('loggedIn') == 'yes') {

            $scope.loggedIn = 'yes';
            $scope.userID = $window.localStorage.getItem('userID');
            $scope.userEmail = $window.localStorage.getItem('userEmail');
            $scope.userToken = $window.localStorage.getItem('userToken');
            $scope.isAdmin = $window.localStorage.getItem('is_admin');

            $scope.trackList = [];
            $scope.t = 'asd';
            var tracks = getNames();

            function getNames() {
                var userFav = {
                    url: '/api/users/favorites',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + $window.localStorage.getItem('userToken')
                    }
                };

                $http(userFav).then(function(response) {
                    var favArray = response['data'];
                    for (var i in favArray) {
                        var Tracks = $resource('/api/music/:id', {
                            id: '@_id'
                        }, {
                            update: {
                                method: 'GET'
                            }
                        });

                        Tracks.get({
                            id: favArray[i]
                        }, function(track) {
                            $scope.trackList.push(track);
                            console.log($scope.trackList);
                        });
                    }
                });
            }

        } else {
            $location.path('/login');
        }

        $scope.unlike = function(id) {

            var Like = $resource('/api/music/unlike');
            var data = {
                'userID': $window.localStorage.getItem('userID'),
                'trackID': id
            };
            Like.save(data, function(res) {
                console.log(res);
                $location.path('/favorites');
            });

        }
    }
]);
