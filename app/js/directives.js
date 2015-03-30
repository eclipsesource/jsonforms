'use strict';

var jsonFormsDirectives = angular.module('jsonForms.directives', []);

jsonFormsDirectives.directive('qbMapping', function() {
    console.log("Directive was run");
    return {
        restrict: "E",
        replace: true,
        link: function ($scope, element, attrs) {
            console.log("link  was run");
            $scope.baseUrl = attrs.baseUrl;
        },
        scope: {
            baseUrl: "&"
        },
        controller: "FormCtrl"
    };
});

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
        templateUrl: 'templates/control.html'
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
        templateUrl: 'templates/element.html',
        compile: function(element){
            return RecursionHelper.compile(element);
        }
    };
});


