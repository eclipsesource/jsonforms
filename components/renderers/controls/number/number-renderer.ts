///<reference path="../../../references.ts"/>

class NumberRenderer implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<control><input type="number" step="0.01" id="${schemaPath}" class="form-control jsf-control jsf-control-number" data-jsonforms-validation data-jsonforms-model/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'number';
    }
}

angular.module('jsonforms.renderers.controls.number').run(['RenderService', function(RenderService) {
    RenderService.register(new NumberRenderer());
}]);
