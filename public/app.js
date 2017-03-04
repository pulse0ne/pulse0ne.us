'use strict';

var app = angular.module('app', ['ngAnimate', 'ngAria', 'ngRoute']);

app.service('httpService', [
    '$http',
    function ($http) {
        
    }
]);

app.controller('mainController', [
    '$scope',
    'httpService',
    function ($scope, http) {

    }
]);
