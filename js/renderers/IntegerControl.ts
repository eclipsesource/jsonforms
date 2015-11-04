///<reference path="..\services.ts"/>

class IntegerControl implements JSONForms.IRenderer {

    priority = 2;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, services: JSONForms.Services): JSONForms.IRenderDescription {
        var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element.label);
        control['template'] = `<control><input type="number" step="1" id="${schemaPath}" class="form-control jsf-control jsf-control-integer" data-jsonforms-validation data-jsonforms-model/></control>`;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
    }
}

var app = angular.module('jsonforms.integerControl', []);

app.run(['RenderService', 'RenderDescriptionFactory', (RenderService) => {
    RenderService.register(new IntegerControl());
}]);
