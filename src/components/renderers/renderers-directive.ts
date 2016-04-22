
import {PathUtil} from "../services/pathutil";

class Widget implements ng.IDirective {
    restrict   = "E";
    replace    = true;
    transclude = true;
    template   = `<div class="col-sm-{{vm.size}} jsf-label ng-transclude"></div>`
}

class DynamicWidget implements ng.IDirective {

    constructor (private $compile: ng.ICompileService, private $templateRequest: ng.ITemplateRequestService) { }

    restrict = 'E';
    scope = {element: "="};
    replace = true;
    link = (scope, element) => {
        if (scope.element.templateUrl) {
            this.$templateRequest(scope.element.templateUrl).then((template) => {
                var updatedTemplate = this.replaceJSONFormsAttributeInTemplate(template, scope.element.path);
                var compiledTemplate = this.$compile(updatedTemplate)(scope);
                element.replaceWith(compiledTemplate);
            })
        } else {
            var updatedTemplate = this.replaceJSONFormsAttributeInTemplate(scope.element.template, scope.element.path);
            var template = this.$compile(updatedTemplate)(scope);
            element.replaceWith(template);
        }
    };

    replaceJSONFormsAttributeInTemplate(template: string, propertyPath:string): string {
        if (propertyPath !== undefined && propertyPath.length > 0) {
            var path = `ng-model="element.instance${PathUtil.toPropertyAccessString(propertyPath)}"`;
            return template
                .replace(new RegExp("data-jsonforms-model", "g"), path)
                .replace(new RegExp("data-jsonforms-validation", "g"), "ng-change='element.modelChanged()'");
        } else {
            return template;
        }
    }
}

// TODO (?) http://stackoverflow.com/questions/23535994/implementing-angularjs-directives-as-classes-in-typescript
export default angular.module('jsonforms.renderers')
    .directive('jsonformsWidget', () => new Widget())
    .directive('jsonformsDynamicWidget', ['$compile', '$templateRequest',
        ($compile: ng.ICompileService, $templateRequest: ng.ITemplateRequestService) =>
            new DynamicWidget($compile, $templateRequest)
    ]).name;
