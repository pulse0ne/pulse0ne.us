'use strict';

var app = angular('adminApp', ['ngAnimate', 'ngAria', 'ngRoute']);

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
