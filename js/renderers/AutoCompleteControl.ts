///<reference path="..\services.ts"/>

class AutoCompleteControl implements JSONForms.IRenderer {

    priority = 3;

    constructor(private pathResolver: JSONForms.PathResolver) {}

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);

        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<input type="text" auto-complete id="${schemaPath}" class="form-control jsf-control jsf-control-string" data-jsonforms-model data-jsonforms-validation/>`;
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

app.run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new AutoCompleteControl(PathResolver));
}]);