angular.module('avm-mock', ['ngRoute', 'smart-table'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'home',
            controllerAs: 'controller'
        }).when('/login', {
            templateUrl: 'login.html',
            controller: 'navigation',
            controllerAs: 'controller'
        }).when('/time', {
            templateUrl: 'time.html',
            controller: 'time',
            controllerAs: 'controller'
        }).otherwise('/');

        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    })
    .controller('home', ['$rootScope', '$http', function ($rootScope, $http) {
        console.log("Inside controller function");
        var self = this;
        if ($rootScope.authenticated) {
            $http.get('token').then(function (response) {
                $http({
                    url: 'resource/',
                    method: 'GET',
                    headers: {
                        'X-Auth-Token': response.data.token
                    }
                }).then(function (response) {
                    self.greeting = response.data;
                });
            });
        }
        var addresses = ['67 Evaline Street Campsie 2194', '226 Tower Street Panania 2213',
            '2 Market Street Sydney 2000'];
        self.itemsByPage = 10;

        function createRandomItem() {
            var address = addresses[Math.floor(Math.random() * 3)];
            var precisionScore = Math.floor(Math.random() * 100);
            var confidenceScore = Math.floor(Math.random() * 100);
            var fsd = Math.floor(Math.random() * 100);
            var marketValue = Math.floor(Math.random() * 1000000);

            return {
                address: address,
                precisionScore: precisionScore,
                confidenceScore: confidenceScore,
                fsd: fsd,
                marketValue: marketValue
            }
        }

        self.rowCollection = [];
        for (var j = 0; j < 200; j++) {
            self.rowCollection.push(createRandomItem());
        }
    }])
    .controller('navigation', function ($rootScope, $http, $location) {
        var self = this;
        $rootScope.authenticated = false;
        var authenticate = function (credentials, callback) {
            console.log("Inside authenticate");
            var headers = credentials ? {
                authorization: "Basic "
                + btoa(credentials.username + ":" + credentials.password)
            } : {};

            $http.get('user', {headers: headers}).then(function (response) {
                if (response.data.name) {
                    $rootScope.authenticated = true;
                } else {
                    $rootScope.authenticated = false;
                }
                callback && callback();
            }, function (error) {
                console.log("error getting user")
                $rootScope.authenticated = false;
                callback && callback();
            });
        }

        //authenticate();
        self.credentials = {};
        self.login = function () {
            authenticate(self.credentials, function () {
                if ($rootScope.authenticated) {
                    $location.path("/");
                    self.error = false;
                } else {
                    $location.path("/login");
                    self.error = true;
                }
            });
        };

        self.logout = function () {
            $http.post('logout', {}).finally(function () {
                $rootScope.authenticated = false;
                $location.path("/");
            });
        }
    })
    .controller('time', function ($http) {
        var self = this;
        $http.get('/dateTime/').then(function (response) {
            self.result = response.data;
        });
    });
