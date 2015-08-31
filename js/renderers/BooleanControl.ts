///<reference path="..\services.ts"/>

class BooleanControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, subSchema, schemaPath, element.label);
        control['template'] = `<input type="checkbox" id="${schemaPath}" class="qb-control qb-control-boolean" ui-validate="\'element.validate($value)\'" data-jsonforms-model/>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    }
}

var app = angular.module('jsonForms.booleanControl', []);

app.run(['JSONForms.RenderService', function(RenderService) {
    RenderService.register(new BooleanControl());
}]);