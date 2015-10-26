///<reference path="../references.ts"/>

angular.module('jsonforms.renderers').directive('widget', function ():ng.IDirective {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: `<div class="col-sm-{{element.size}} jsf-label ng-transclude"></div>`
    }
}).directive('dynamicWidget', ['$compile', '$templateRequest', function ($compile: ng.ICompileService, $templateRequest: ng.ITemplateRequestService) {
    var replaceJSONFormsAttributeInTemplate = (template: string): string => {
        return template
            .replace("data-jsonforms-model",      "ng-model='element.instance[element.path]'")
            .replace("data-jsonforms-validation", `ng-change='element.validate()'`);
    };
    return {
        restrict: 'E',
        scope: {element: "="},
        replace: true,
        link: function(scope, element) {
            if (scope.element.templateUrl) {
                $templateRequest(scope.element.templateUrl).then(function(template) {
                    var updatedTemplate = replaceJSONFormsAttributeInTemplate(template);
                    var compiledTemplate = $compile(updatedTemplate)(scope);
                    element.replaceWith(compiledTemplate);
                })
            } else {
                var updatedTemplate = replaceJSONFormsAttributeInTemplate(scope.element.template);
                var template = $compile(updatedTemplate)(scope);
                element.replaceWith(template);
            }
        }
    }
}]);


