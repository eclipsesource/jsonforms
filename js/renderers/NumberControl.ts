///<reference path="..\services.ts"/>

class NumberControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services) {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element.label);
        control['template'] = `<control><input type="number" step="0.01" id="${schemaPath}" class="form-control jsf-control jsf-control-number" data-jsonforms-validation data-jsonforms-model/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'number';
    }
}

var app = angular.module('jsonforms.numberControl', []);

app.run(['RenderService', 'RenderDescriptionFactory', (RenderService, RenderDescriptionFactory) =>
    RenderService.register(new NumberControl())
]);
