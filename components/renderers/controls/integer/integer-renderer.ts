///<reference path="../../../references.ts"/>

class IntegerRenderer implements JSONForms.IRenderer {

    priority = 2;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-control>
          <input type="number" step="1" id="${schemaPath}" class="form-control jsf-control jsf-control-integer" ${element.readOnly ? 'readonly' : ''} data-jsonforms-validation data-jsonforms-model/>
        </jsonforms-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
    }
}

angular.module('jsonforms.renderers.controls.integer').run(['RenderService', (RenderService) => {
    RenderService.register(new IntegerRenderer());
}]);
