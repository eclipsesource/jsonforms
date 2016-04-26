///<reference path="../../../references.ts"/>

class MaterialNumberRenderer implements JSONForms.IRenderer {

    priority = 10;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services) {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-material-control><input type="number" step="0.01" id="${schemaPath}" aria-label="{{element.label}}" data-jsonforms-validation data-jsonforms-model/></jsonforms-material-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'number';
    }
}

angular.module('jsonforms-material.renderers.controls.number').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialNumberRenderer());
}]);
