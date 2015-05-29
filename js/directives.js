'use strict';

var jsonFormsDirectives = angular.module('jsonForms.directives', []);

jsonFormsDirectives.directive('control', function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            control: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',
            topValidateInteger: '='
        },
        templateUrl: '../app/templates/control.html'
    };
});

jsonFormsDirectives.directive('recelement', function(RecursionHelper) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            element: '=',
            bindings: '=',
            topOpenDate: '=',
            topValidateNumber: '=',            
            topValidateInteger: '='
        },
        templateUrl: '../app/templates/element.html',
        compile: function(element){
            return RecursionHelper.compile(element);
        }
    };
});


