///<reference path="..\services.ts"/>

class EnumControl implements JSONForms.IRenderer {

    priority = 3;

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var enums = subSchema.enum;
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, subSchema, schemaPath, element.label);
        control['template'] = `<select ng-options="option as option for option in element.options" id="${schemaPath}" class="form-control qb-control qb-control-enum" data-jsonforms-model ></select>`;
        control['options'] = enums;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema.hasOwnProperty('enum');
    }
}

var app = angular.module('jsonForms.enumControl', []);

app.run(['JSONForms.RenderService', function(RenderService) {
    RenderService.register(new EnumControl());
}]);