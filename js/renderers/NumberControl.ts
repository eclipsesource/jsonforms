///<reference path="..\services.ts"/>

class NumberControl implements JSONForms.IRenderer {

    priority = 2;

    render(element:JSONForms.UISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider) {
        var control = new JSONForms.ControlResult(dataProvider.data, subSchema, schemaPath);
        control['template'] = `<input type="number" step="0.01" id="${schemaPath}" class="form-control qb-control qb-control-number" data-jsonforms-validation data-jsonforms-model/>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'number';
    }
}

var app = angular.module('jsonForms.numberControl', []);

app.run(['JSONForms.RenderService', function(RenderService) {
    RenderService.register(new NumberControl());
}]);