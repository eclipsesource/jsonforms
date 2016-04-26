///<reference path="../../references.ts"/>



angular.module('jsonforms-material.renderers.layouts').directive('jsonformsMaterialLayout', ():ng.IDirective => {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: 'components/renderers/layouts/layout.html'
    }
})
