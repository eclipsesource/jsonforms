///<reference path="../../../references.ts"/>

class AutoCompleteRenderer implements JSONForms.IRenderer {

    priority = 3;

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<control><input type="text" autocomplete id="${schemaPath}" class="form-control jsf-control jsf-control-string" data-jsonforms-model data-jsonforms-validation/></control>`;
        control['suggestion'] = element["suggestion"];

        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        var isApplicable = uiElement.type == 'Control' && uiElement.hasOwnProperty("suggestion");
        return isApplicable;
    }
}

angular.module('jsonforms.renderers.controls.autocomplete').run(['RenderService', function(RenderService) {
    RenderService.register(new AutoCompleteRenderer());
}]);