///<reference path="..\services.ts"/>

class BooleanControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {
        var path = this.refResolver.normalize(this.refResolver.getSchemaRef(uiPath));
        var id = path;
        return {
            "type": "Control",
            "size": 99,
            "id": id,
            "path": path,
            "label": element['label'],
            "instance": instance,
            // $$data is brought into scope by the directive by directive
            "template": `<div class="checkbox-inline">
            <input type="checkbox" id="${id}" class="qb-control qb-control-boolean" data-jsonforms-model/>
            </div>`
        };
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string):boolean {
        var subSchema = this.refResolver.resolveSchema(jsonSchema, schemaPath);
        if (subSchema == undefined) {
            return false;
        }
        return uiElement.type == 'Control' && subSchema.type == 'boolean';
    }
}

var app = angular.module('jsonForms.booleanControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new BooleanControl((ReferenceResolver)));
}]);