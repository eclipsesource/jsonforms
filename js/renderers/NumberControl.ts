///<reference path="..\services.ts"/>

class NumberControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {

        var path = this.refResolver.normalize(this.refResolver.getSchemaRef(uiPath));
        var id = path;
        var options = {
            "type": "Control",
            "size": 99,
            "id": id,
            "path": path,
            "label": element['label'],
            "instance": instance,
            "template": `<input type="text" id="${id}" class="form-control qb-control qb-control-number" ui-validate="\'element.validate($value)\'" data-jsonforms-model/>`,
            alerts: [{"type":"danger","msg":"Must be a valid number!"}],
            validate: function (value) {
                if (value !== undefined && value !== null && isNaN(value)) {
                    options.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid number!'
                    };
                    options.alerts.push(alert);
                    return false;
                }
                options.alerts = [];
                return true;
            }
        };
        return options;
    }

    isApplicable(uiElement: IUISchemaElement, jsonSchema: SchemaElement, schemaPath: string):boolean {
        var subSchema = this.refResolver.resolveSchema(jsonSchema, schemaPath);
        if (subSchema == undefined) {
            return false;
        }
        return uiElement.type == 'Control' && subSchema.type == 'number';
    }
}

var app = angular.module('jsonForms.numberControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new NumberControl((ReferenceResolver)));
}]);