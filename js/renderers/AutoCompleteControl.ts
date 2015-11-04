///<reference path="..\services.ts"/>

class AutoCompleteControl implements JSONForms.IRenderer {

    priority = 3;

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = new JSONForms.ControlRenderDescription(schemaPath, services, element.label);
        control['template'] = `<control><input type="text" auto-complete id="${schemaPath}" class="form-control jsf-control jsf-control-string" data-jsonforms-model data-jsonforms-validation/></control>`;
        control['suggestion'] = element["suggestion"];

        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        var isApplicable = uiElement.type == 'Control' && uiElement.hasOwnProperty("suggestion");
        return isApplicable;
    }
}

var app = angular.module('jsonforms.autoCompleteControl', []).directive('autoComplete', function($timeout):ng.IDirective {

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

app.run(['RenderService', function(RenderService) {
    RenderService.register(new AutoCompleteControl());
}]);