///<reference path="..\services.ts"/>

class StringControl implements JSONForms.IRenderer {

    priority = 2;

    static inject = ['RenderDescriptionFactory'];

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element.label);
        control['template'] = `<control><input type="text" id="${schemaPath}" class="form-control jsf-control jsf-control-string" data-jsonforms-model data-jsonforms-validation/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'string';
    }

}

var app = angular.module('jsonforms.stringControl', []);

app.run(['RenderService', 'RenderDescriptionFactory', (RenderService) =>
    RenderService.register(new StringControl())
]);
