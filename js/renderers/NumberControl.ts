///<reference path="..\services.ts"/>

class NumberControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver, private scope: ng.IRootScopeService) { }

    render(element:jsonforms.services.UISchemaElement, subSchema: SchemaElement, schemaPath: string, dataProvider: jsonforms.services.IDataProvider) {
        var options = {
            "type": "Control",
            "size": 99,
            "label": element['label'],
            "path": [this.refResolver.normalize(schemaPath)],
            "instance": dataProvider.data,
            "template": `<input type="text" id="${schemaPath}" class="form-control qb-control qb-control-number" ui-validate="\'element.validate($value)\'" data-jsonforms-model=""/>`,
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

    isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
        return uiElement.type == 'Control' && subSchema.type == 'number';
    }
}

var app = angular.module('jsonForms.numberControl', []);

app.run(['RenderService', 'ReferenceResolver', '$rootScope', function(RenderService, ReferenceResolver, scope) {
    RenderService.register(new NumberControl(ReferenceResolver, scope));
}]);