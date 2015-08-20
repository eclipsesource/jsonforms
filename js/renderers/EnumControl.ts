///<reference path="..\services.ts"/>

class EnumControl implements jsonforms.services.IRenderer {

    priority = 3;

    constructor(private refResolver: jsonforms.services.IReferenceResolver) { }

    render(element:jsonforms.services.UISchemaElement, schema, instance, uiPath: string, dataProvider) {
        var path = this.refResolver.normalize(this.refResolver.get(uiPath));
        var id = path;
        var enums = element['scope'].enum;
        return {
            "type": "Control",
            "size": 99,
            "id": id,
            "path": path,
            "label": element['label'],
            "instance": instance,
            "options": enums,
            "template": `<select ng-options="option as option for option in element.options" id="${id}" class="form-control qb-control qb-control-enum" data-jsonforms-model ></select>`
        };
    }

    isApplicable(element: jsonforms.services.UISchemaElement):boolean {
        // TODO: enum are valid for any instance type, not just strings
        if (element.hasOwnProperty('scope')) {
            return element['scope'].hasOwnProperty('enum');
        }
        return false;
    }
}

var app = angular.module('jsonForms.enumControl', []);

app.run(['RenderService', 'ReferenceResolver', function(RenderService, ReferenceResolver) {
    RenderService.register(new EnumControl((ReferenceResolver)));
}]);