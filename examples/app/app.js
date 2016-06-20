'use strict';

var app = angular.module('makeithappen', [
    'ngRoute',
    'jsonforms'
]);

angular.forEach(['jsonforms-bootstrap'], function(dep) {
   app.requires.push(dep);
});

