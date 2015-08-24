///<reference path="..\services.ts"/>

class StringControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element: IUISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider): jsonforms.services.IResult {
        var result = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": `<input type="text" id="${schemaPath}" class="form-control qb-control qb-control-string" data-jsonforms-model/>`,
            "alerts": []
        };
        dataProvider.fetchData().then(data => {
           result['instance'] = data;
        });
        return result;
    }

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'string';
    }

}

var app = angular.module('jsonForms.stringControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new StringControl((ReferenceResolver)));
}]);