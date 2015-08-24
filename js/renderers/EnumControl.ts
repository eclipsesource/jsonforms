///<reference path="..\services.ts"/>

class EnumControl implements jsonforms.services.IRenderer {

    priority = 3;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IResult {
        var enums = subSchema.enum;
        var result ={
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "options": enums,
            "template": `<select ng-options="option as option for option in element.options" id="${schemaPath}" class="form-control qb-control qb-control-enum" data-jsonforms-model ></select>`
        };
        return result;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string): boolean {
        // TODO: enum are valid for any instance type, not just strings
        return uiElement.type == 'Control' && subSchema.hasOwnProperty('enum');
    }
}

var app = angular.module('jsonForms.enumControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new EnumControl((ReferenceResolver)));
}]);