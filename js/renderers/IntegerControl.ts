///<reference path="..\services.ts"/>

class IntegerControl implements jsonforms.services.IRenderer {

    priority = 2;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {
        var path = this.refResolver.normalize(this.refResolver.get(uiPath));
        var id = path;
        var options = {
            "type": "Control",
            "size": 99,
            "id": id,
            "path": path,
            "label": element['label'],
            "instance": instance,
            "template": `<input type="text" id="${id}" class="form-control qb-control qb-control-integer" ui-validate="\'element.validate($value)\'" data-jsonforms-model/>`,
            "alerts": [],
            validate: function (value) {
                if (value !== undefined && value !== null && (isNaN(value) || (value !== "" && !(/^\d+$/.test(value))))) {
                    options.alerts = [];
                    var alert = {
                        type: 'danger',
                        msg: 'Must be a valid integer!'
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

    isApplicable(element:jsonforms.services.UISchemaElement):boolean {
        if (element.hasOwnProperty('scope')) {
            return element['scope'].type === "integer";
        }
        return false;
    }
}

var app = angular.module('jsonForms.integerControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new IntegerControl((ReferenceResolver)));
}]);