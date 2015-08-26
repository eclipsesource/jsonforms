///<reference path="..\services.ts"/>

class StringControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IResult {
        var control = new JSONForms.ControlResult(dataProvider.data, subSchema, schemaPath);
        control['template'] = `<input type="text" id="${schemaPath}" class="form-control qb-control qb-control-string" data-jsonforms-model/>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'string';
    }

}

var app = angular.module('jsonForms.stringControl', []);

app.run(['JSONForms.RenderService', function(RenderService) {
    RenderService.register(new StringControl());
}]);