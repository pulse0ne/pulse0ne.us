'use strict';

var app = angular.module('app', ['ngAnimate', 'ngAria', 'ngRoute']);

var _pages = {
    home: { fa: 'home', title: 'Home', path: '/', template: 'templates/home.tmpl.html' },
    blog: { fa: 'edit', title: 'Blog', path: '/blog', template: 'templates/blog.tmpl.html' },
    resume: { fa: 'vcard', title: 'Resume', path: '/resume', template: 'templates/resume.tmpl.html' }
};

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    Object.keys(_pages).forEach(function (page) {
        $routeProvider.when(_pages[page].path, {
            templateUrl: _pages[page].template,
            controller: 'mainController'
        });
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);

app.service('httpService', [
    '$http',
    function ($http) {
        
    }
]);

app.controller('mainController', [
    '$scope',
    'httpService',
    function ($scope, http) {
        $scope.pages = _pages;
        $scope.active = $scope.pages.home;

        $scope.navigate = function (page) {
            $scope.active = page;
        };
    }
]);
