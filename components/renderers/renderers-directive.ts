///<reference path="../references.ts"/>

class Widget implements ng.IDirective {
    restrict   = "E";
    replace    = true;
    transclude = true;
    template   = `<div class="col-sm-{{element.size}} jsf-label ng-transclude"></div>`
}

class DynamicWidget implements ng.IDirective {

    constructor (private $compile: ng.ICompileService, private $templateRequest: ng.ITemplateRequestService) { }

    restrict = 'E';
    scope = {element: "="};
    replace = true;
    link = (scope, element) => {
        var fragments = scope.element.path !== undefined ? scope.element.path.split('/') : [];
        if (scope.element.templateUrl) {
            this.$templateRequest(scope.element.templateUrl).then((template) => {
                var updatedTemplate = this.replaceJSONFormsAttributeInTemplate(template, fragments);
                var compiledTemplate = this.$compile(updatedTemplate)(scope);
                element.replaceWith(compiledTemplate);
            })
        } else {
            var updatedTemplate = this.replaceJSONFormsAttributeInTemplate(scope.element.template, fragments);
            var template = this.$compile(updatedTemplate)(scope);
            element.replaceWith(template);
        }
    };

    replaceJSONFormsAttributeInTemplate(template, fragments): string {
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
    }
}

// TODO (?) http://stackoverflow.com/questions/23535994/implementing-angularjs-directives-as-classes-in-typescript
angular.module('jsonforms.renderers')
    .directive('jsonformsWidget', () => new Widget())
    .directive('jsonformsDynamicWidget', ['$compile', '$templateRequest',
        ($compile: ng.ICompileService, $templateRequest: ng.ITemplateRequestService) =>
            new DynamicWidget($compile, $templateRequest)
    ]);
