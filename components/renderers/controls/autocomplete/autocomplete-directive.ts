///<reference path="../../../references.ts"/>

angular.module('jsonforms.renderers.controls.autocomplete').directive('autocomplete', function($timeout):ng.IDirective {

    return function(scope, iElement, iAttrs) {
        $(iElement)["autocomplete"]({
            source: scope.element.suggestion,
            select: function() {
                $timeout(function() {
                    $(iElement).trigger('input');
                }, 0);
            }
        }).autocomplete( "widget" ).addClass( "jsf-control-autocomplete" );
    };
});
