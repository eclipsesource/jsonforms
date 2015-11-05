///<reference path="../references.ts"/>

angular.module('jsonforms.renderers').directive('widget', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: `<div class="col-sm-{{element.size}} jsf-label ng-transclude"></div>`
    }
}).directive('dynamicWidget', ['$compile', '$templateRequest', function ($compile: ng.ICompileService, $templateRequest: ng.ITemplateRequestService) {
    var replaceJSONFormsAttributeInTemplate = (template, fragments): string => {
        var path = [];
        for (var fragment in fragments) {
            path.push("['" + fragments[fragment] + "']");
        }
        var pathBinding = "ng-model=\"element.instance" + path.join('') + "\"";
        if (fragments.length > 0) {
            return template
                .replace("data-jsonforms-model", pathBinding)
                .replace("data-jsonforms-validation", "ng-change='element.modelChanged()'");
        } else {
            return template;
        }
    };
    return {
        restrict: 'E',
        scope: {element: "="},
        replace: true,
        link: function(scope, element) {
            var fragments = scope.element.path !== undefined ? scope.element.path.split('/') : [];
            if (scope.element.templateUrl) {
                $templateRequest(scope.element.templateUrl).then(function(template) {
                    var updatedTemplate = replaceJSONFormsAttributeInTemplate(template, fragments);
                    var compiledTemplate = $compile(updatedTemplate)(scope);
                    element.replaceWith(compiledTemplate);
                })
            } else {
                var updatedTemplate = replaceJSONFormsAttributeInTemplate(scope.element.template, fragments);
                var template = $compile(updatedTemplate)(scope);
                element.replaceWith(template);
            }
        }
    }
}]);




