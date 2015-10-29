///<reference path="..\services.ts"/>

class StringControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<control><input type="text" id="${schemaPath}" class="form-control jsf-control jsf-control-string" data-jsonforms-model data-jsonforms-validation/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'string';
    }

}

var app = angular.module('jsonforms.stringControl', []);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new StringControl());
}]);
