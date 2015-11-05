///<reference path="../../../references.ts"/>

class IntegerRenderer implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element.label, element.rule);
        control['template'] = `<control><input type="number" step="1" id="${schemaPath}" class="form-control jsf-control jsf-control-integer" data-jsonforms-validation data-jsonforms-model/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
    }
}

angular.module('jsonforms.renderers.controls.integer').run(['RenderService', (RenderService) => {
    RenderService.register(new IntegerRenderer());
}]);
