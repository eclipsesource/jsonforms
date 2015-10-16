///<reference path="..\services.ts"/>

class EnumControl implements JSONForms.IRenderer {

    priority = 3;

    constructor(private pathResolver: JSONForms.PathResolver) {}

    render(element: IUISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
        var enums =  subSchema.enum;
        console.log(JSON.stringify(schema));
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath, element.label);
        control['template'] = `<control><select ng-options="option as option for option in element.options" id="${schemaPath}" class="form-control jsf-control jsf-control-enum" data-jsonforms-model ></select></control>`;
        control['options'] = enums;
        return control;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema.hasOwnProperty('enum');
    }
}

var app = angular.module('jsonforms.enumControl', []);

app.run(['RenderService', 'PathResolver', function(RenderService, PathResolver) {
    RenderService.register(new EnumControl(PathResolver));
}]);
