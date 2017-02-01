'use strict';

var module = angular.module('docs.menudirective',[]);

module.directive('docsMenu', ['$anchorScroll', function($anchorScroll) {
    return {
        restrict: 'E',
        template: require('../../partials/docs/docs_menu.html'),
        link: function (scope) {
            scope.showDocsNav = false;
            scope.toggleDocsMenu = function () {
                scope.showDocsNav = !scope.showDocsNav;
            };
            scope.hideDocsMenu = function () {
                scope.showDocsNav = false;
                $anchorScroll();
            };
        }
    };
}]);