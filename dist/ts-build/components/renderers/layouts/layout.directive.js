"use strict";
var layoutTemplate = "<div ng-hide=\"vm.hide || vm.uiSchema.elements.length==0\" ng-transclude></div>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.layouts', ['jsonforms.renderers'])
    .directive('jsonformsLayout', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'layout.html'
    };
})
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('layout.html', layoutTemplate);
    }])
    .name;
//# sourceMappingURL=layout.directive.js.map