///<reference path="../../../references.ts"/>

class BooleanRenderer implements JSONForms.IRenderer {

    priority = 2;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services) {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath,  services, element);
        control['template'] = `<jsonforms-control>
          <input type="checkbox" id="${schemaPath}" class="jsf-control jsf-control-boolean" ${element.readOnly ? 'disabled="disabled"' : ''} data-jsonforms-validation data-jsonforms-model/>
        </jsonforms-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'boolean';
    }
}

angular.module('jsonforms.renderers.controls.boolean').run(['RenderService', (RenderService) => {
    RenderService.register(new BooleanRenderer());
}]);
