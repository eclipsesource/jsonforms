///<reference path="../../../references.ts"/>

class MaterialStringRenderer implements JSONForms.IRenderer {

    priority = 10;

    static inject = ['RenderDescriptionFactory'];

    render(element: IControlObject, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
        control['template'] = `<jsonforms-material-control><input type="text" id="${schemaPath}" aria-label="{{element.label}}" data-jsonforms-model data-jsonforms-validation/></jsonforms-material-control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'string';
    }

}

angular.module('jsonforms-material.renderers.controls.string').run(['RenderService', (RenderService) => {
    RenderService.register(new MaterialStringRenderer());
}]);
