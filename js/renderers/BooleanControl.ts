///<reference path="..\services.ts"/>

class BooleanControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider) {
        return {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            path: [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": `<div class="checkbox-inline">
            <input type="checkbox" id="${schemaPath}" class="qb-control qb-control-boolean" data-jsonforms-model/>
            </div>`
        };
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    }
}

var app = angular.module('jsonForms.booleanControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new BooleanControl(ReferenceResolver));
}]);