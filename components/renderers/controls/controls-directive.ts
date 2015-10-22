///<reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('jsonforms.renderers.controls').directive('control', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'components/renderers/controls/control.html'
    }
});