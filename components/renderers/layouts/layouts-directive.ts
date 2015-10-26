///<reference path="../../references.ts"/>

angular.module('jsonforms.renderers.layouts').directive('layout', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'components/renderers/layouts/layout.html'
    }
})