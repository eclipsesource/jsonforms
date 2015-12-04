///<reference path="../../../references.ts"/>

angular.module('jsonforms.renderers.controls.autocomplete').directive('jsonformsAutocomplete', ($timeout):ng.IDirective => {

    return (scope, iElement) => {
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
