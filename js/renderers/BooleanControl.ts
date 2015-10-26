///<reference path="..\services.ts"/>

class BooleanControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services) {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath,  services, element.label);
        control['template'] = `<control><input type="checkbox" id="${schemaPath}" class="jsf-control jsf-control-boolean" data-jsonforms-validation data-jsonforms-model/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    }
}

var app = angular.module('jsonforms.booleanControl', []);

app.run(['RenderService', 'RenderDescriptionFactory', (RenderService) =>
    RenderService.register(new BooleanControl())
]);
