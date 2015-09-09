///<reference path="..\services.ts"/>

class IntegerControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<input type="number" step="1" id="${schemaPath}" class="form-control jsf-control jsf-control-integer" data-jsonforms-validation data-jsonforms-model/>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'integer';
    }
}

var app = angular.module('jsonForms.integerControl', []);

app.run(['JSONForms.RenderService', function(RenderService) {
    RenderService.register(new IntegerControl());
}]);