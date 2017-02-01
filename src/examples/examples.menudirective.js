'use strict';

var module = angular.module('examples.menudirective',[]);

module.directive('examplesMenu', ['$anchorScroll', function($anchorScroll) {
    return {
        restrict: 'E',
        template: require('../../partials/examples/examples_menu.html'),
        link: function (scope) {
            scope.showDocsNav = false;
            scope.toggleDocsMenu = function () {
                scope.showDocsNav = !scope.showDocsNav;
            };
            // TODO: rename
            scope.hideDocsMenu = function () {
                scope.showDocsNav = false;
                $anchorScroll()
            };
        }
    };
}]);