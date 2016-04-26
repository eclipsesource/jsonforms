///<reference path="../../../references.ts"/>

class MaterialIntegerRenderer implements JSONForms.IRenderer {

    priority = 10;

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-material-control><input type="number" step="1" id="${schemaPath}" aria-label="{{element.label}}" data-jsonforms-validation data-jsonforms-model/></jsonforms-material-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
    }
}

angular.module('jsonforms-material.renderers.controls.integer').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialIntegerRenderer());
}]);
